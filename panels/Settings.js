import React from "react";
import fetch2 from "../components/Fetch";
import {
  Panel,
  Div,
  Button,
  PanelHeader,
  PanelHeaderBack,
  FormLayout,
  FormItem,
  File,
  Checkbox,
  FormLayoutGroup,
  Input,
  Group,
} from "@vkontakte/vkui";

import {
  Icon24DoneOutline,
  Icon24VolumeOutline,
  Icon24Camera,
} from "@vkontakte/icons";

import axios from "axios";

/*eslint eqeqeq: "off"*/

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snackbar: null,
      loaded: false,
      licenses0: "",
      licenses1: "",
      licenses2: "",
      licenses3: "",
      licenses4: "",
      licenses5: "",
      licenses6: "",
      licenses7: "",
      licenses8: "",
      licenses9: "",
      sent: false,
      good_name: "",
      popular: 0,
      good_image: "",
      good_track: "",
      count: 0,
      uploaded_photo: false,
      uploaded_doc: false,
      license_data: null,
      selectedFile: null,
      selectedFile2: null,
    };
    this.sendForm = this.sendForm.bind(this);
    this.validate = this.validate.bind(this);
  }

  componentDidMount() {
    this.props.setSpinner(true);
    fetch2("getGoodInfo", "id=" + this.props.good_id).then((data) => {
      this.setState({
        good_name: data.result.goods[0].name,
        count: data.result.licenses.length,
        good_track: data.result.goods[0].track,
        license_data: data.result.licenses,
        good_image: data.result.goods[0].image,
        licenses0: data.result.goods[0].license1,
        licenses1: data.result.goods[0].license2,
        licenses2: data.result.goods[0].license3,
        licenses3: data.result.goods[0].license4,
        licenses4: data.result.goods[0].license5,
        licenses5: data.result.goods[0].license6,
        licenses6: data.result.goods[0].license7,
        licenses7: data.result.goods[0].license8,
        licenses8: data.result.goods[0].license9,
        licenses9: data.result.goods[0].license10,
        popular: data.result.goods[0].popular,
        loaded: true,
      });
      this.props.setSpinner(false);
    });
  }

  validate(textval) {
    var urlregex = new RegExp(
      /[a-zA-Zа-яА-ЯёЁ0-9_-]+(\.[a-zA-Zа-яА-ЯёЁ0-9_-]+)*\.[a-zA-Zа-яА-ЯёЁ]{2,7}(?=$|[^a-zA-Zа-яА-ЯёЁ0-9_-])/g
    );
    if (!urlregex.test(textval.trim())) {
      this.props.setAlert(
        "Отчёт об ошибке",
        "Во всех полях для ввода лицензии может быть указан только URL-адрес. В ином случае сохранить бит не получится."
      );
      this.props.setSpinner(false);
      return false;
    }
  }

  sendForm() {
    let arr = [];
    let f = 0;
    for (let i = 0; i < this.state.count; i++) {
      if (this.validate(this.state["licenses" + i]) === false) break;
      arr.push(this.state["licenses" + i]);
      f = f + 1;
    }
    if (f === this.state.count) {
      fetch2(
        "editGood",
        "id=" +
          this.props.good_id +
          "&name=" +
          encodeURI(this.state.good_name) +
          "&track=" +
          encodeURI(this.state.good_track) +
          "&image=" +
          encodeURI(this.state.good_image) +
          "&popular=" +
          this.state.popular +
          "&licenses=" +
          encodeURI(arr)
      )
        .then((data) => {
          if (data.result === "ok") {
            this.props.setSnackbar("Бит успешно изменен!", 3000, true);
            this.props.setSpinner(false);
            this.props.go();
          }
          if (data.result === "flood") {
            this.props.setSnackbar(
              "Ох, флуд-контроль! Попробуйте еще раз через несколько секунд...",
              3000,
              false
            );
            this.props.setSpinner(false);
          }
        })
        .catch(() => this.props.setSpinner(false));
    }
  }

  render() {
    let { id, go } = this.props;
    return (
      <Panel id={id}>
        <PanelHeader
          separator={false}
          left={<PanelHeaderBack onClick={() => go()} />}
        >
          Редактирование
        </PanelHeader>
        {this.props.spinner === false && this.state.loaded === true && (
          <Group>
            <FormLayout
              onSubmit={(e) => {
                e.preventDefault();
                if (
                  this.state.good_name !== "" &&
                  this.state.disabled !== true &&
                  this.state.sent === false
                ) {
                  this.props.setSpinner(true);
                  if (
                    this.state.selectedFile !== null ||
                    this.state.selectedFile2 !== null
                  ) {
                    if (this.state.selectedFile !== null) {
                      var data = new FormData();
                      data.append(
                        "image",
                        this.state.selectedFile,
                        this.state.selectedFile.name
                      );
                      axios
                        .post(
                          "https://api.trestahouse.com/?method=savePhoto&" +
                            window.location.href.slice(
                              window.location.href.indexOf("?") + 1
                            ),
                          data,
                          { headers: { "content-type": "multipart/form-data" } }
                        )
                        .then((data) => {
                          if (data.data.result !== "error") {
                            if (data.data.result === "wrong_type") {
                              this.props.setAlert(
                                "Отчёт об ошибке",
                                "Мы не смогли обновить бит, так как для загрузки доступны лишь файлы типа png и jpg, а также gif."
                              );
                              this.setState({
                                selectedFile2: null,
                              });
                              this.props.setSpinner(false);
                            } else {
                              this.setState({
                                good_image:
                                  "https://cloud.trestahouse.com/drive1/" +
                                  data.data.result,
                                uploaded_photo: true,
                              });
                              if (
                                this.state.selectedFile2 === null ||
                                (this.state.selectedFile2 !== null &&
                                  this.state.uploaded_doc === true)
                              )
                                this.sendForm();
                            }
                          }
                        })
                        .catch(() => {
                          this.props.setAlert(
                            "Отчёт об ошибке",
                            "Мы не смогли загрузить файл, так как не удалось отправить его на сервер."
                          );
                          this.setState({
                            selectedFile2: null,
                          });
                          this.props.setSpinner(false);
                        });
                    }
                    if (this.state.selectedFile2 !== null) {
                      data = new FormData();
                      data.append(
                        "music",
                        this.state.selectedFile2,
                        this.state.selectedFile2.name
                      );
                      axios
                        .post(
                          "https://api.trestahouse.com/?method=saveMusic&" +
                            window.location.href.slice(
                              window.location.href.indexOf("?") + 1
                            ),
                          data,
                          { headers: { "content-type": "multipart/form-data" } }
                        )
                        .then((data) => {
                          if (data.data.result !== "error") {
                            if (data.data.result === "wrong_type") {
                              this.props.setAlert(
                                "Отчёт об ошибке",
                                "Мы не смогли обновить бит, так как для загрузки доступны лишь аудиофайлы типа mp3, wav, ogg."
                              );
                              this.setState({
                                selectedFile2: null,
                              });
                              this.props.setSpinner(false);
                            } else {
                              this.setState({
                                good_track:
                                  "https://cloud.trestahouse.com/drive1/" +
                                  data.data.result,
                                uploaded_doc: true,
                              });
                              if (
                                this.state.selectedFile === null ||
                                (this.state.selectedFile !== null &&
                                  this.state.uploaded_photo === true)
                              )
                                this.sendForm();
                            }
                          }
                        })
                        .catch(() => {
                          this.props.setAlert(
                            "Отчёт об ошибке",
                            "Мы не смогли загрузить файл, так как не удалось отправить его на сервер."
                          );
                          this.setState({
                            selectedFile2: null,
                          });
                          this.props.setSpinner(false);
                        });
                    }
                  } else {
                    this.sendForm();
                  }
                }
              }}
            >
              <FormItem top="Наименование">
                <Input
                  type="text"
                  name="name"
                  required
                  placeholder="Клава Кока - Покинула чат"
                  maxLength="50"
                  value={this.state.good_name}
                  onChange={(e) => {
                    this.setState({
                      good_name: e.target.value
                        .replace(/[@+#+*+?+&+%++]/gi, "")
                        .replace(/\n/, "")
                        .replace(/^\s+/g, ""),
                    });
                  }}
                />
              </FormItem>
              <FormLayoutGroup mode="horizontal">
                <FormItem top="Обложка (до 10 мб)">
                  <File
                    style={{ width: "100%" }}
                    onClick={() => {
                      this.setState({ sent: true });
                      setTimeout(() => this.setState({ sent: false }), 500);
                    }}
                    before={
                      this.state.selectedFile !== null ? (
                        <Icon24DoneOutline />
                      ) : (
                        <Icon24Camera />
                      )
                    }
                    accept="image/x-png,image/png,image/jpeg,image/gif"
                    controlSize="l"
                    onChange={(e) => {
                      e.preventDefault();
                      if (e.target.files[0].size < 10000000) {
                        this.setState({
                          selectedFile: e.target.files[0],
                        });
                      } else {
                        this.props.setAlert(
                          "Отчёт об ошибке",
                          "Обложка не была загружена, так как её размер превышает 10 мб."
                        );
                        this.setState({
                          selectedFile: null,
                        });
                      }
                    }}
                    mode={
                      this.state.selectedFile !== null
                        ? "commerce"
                        : "secondary"
                    }
                  >
                    {this.state.selectedFile !== null
                      ? "Загружено"
                      : "Обновить"}
                  </File>
                </FormItem>
                <FormItem top="Аудиофайл (до 10 мб)">
                  <File
                    style={{ width: "100%" }}
                    onClick={() => {
                      this.setState({ sent: true });
                      setTimeout(() => this.setState({ sent: false }), 250);
                    }}
                    before={
                      this.state.selectedFile2 !== null ? (
                        <Icon24DoneOutline />
                      ) : (
                        <Icon24VolumeOutline />
                      )
                    }
                    accept=".mp3,audio/*"
                    controlSize="l"
                    onChange={(e) => {
                      e.preventDefault();
                      if (e.target.files[0].size < 10000000) {
                        this.setState({
                          selectedFile2: e.target.files[0],
                        });
                      } else {
                        this.props.setAlert(
                          "Отчёт об ошибке",
                          "Аудиофайл не был загружен, так как его размер превышает 10 мб."
                        );
                        this.setState({
                          selectedFile2: null,
                        });
                      }
                    }}
                    mode={
                      this.state.selectedFile2 !== null
                        ? "commerce"
                        : "secondary"
                    }
                  >
                    {this.state.selectedFile2 !== null
                      ? "Загружено"
                      : "Обновить"}
                  </File>
                </FormItem>
              </FormLayoutGroup>
              <FormItem top="Выделение бита">
                <Div style={{ marginTop: -12, marginBottom: -20 }}>
                  {this.state.popular == 1 ? (
                    <Checkbox
                      defaultChecked
                      onChange={() => {
                        let mode = 0;
                        if (this.state.popular == 0) mode = 1;
                        this.setState({ popular: mode });
                      }}
                    >
                      Отметить бит меткой{" "}
                      <span className="recommended">ХИТ</span>
                    </Checkbox>
                  ) : (
                    <Checkbox
                      onChange={(e) => {
                        let mode = 0;
                        if (this.state.popular == 0) mode = 1;
                        this.setState({ popular: mode });
                      }}
                    >
                      Отметить бит меткой{" "}
                      <span className="recommended">ХИТ</span>
                    </Checkbox>
                  )}
                </Div>
              </FormItem>
              {this.state.license_data[0] !== undefined && (
                <FormItem top={"Лицензия: " + this.state.license_data[0].name}>
                  <Input
                    type="text"
                    placeholder="Ссылка на товар"
                    maxLength="200"
                    value={this.state.licenses0}
                    onChange={(e) => {
                      this.setState({
                        licenses0: e.target.value
                          .replace(/[@+#+*+?+&+%+,++]/gi, "")
                          .replace(/\n/, "")
                          .replace(/^\s+/g, ""),
                      });
                    }}
                  />
                </FormItem>
              )}
              {this.state.license_data[1] !== undefined && (
                <FormItem top={"Лицензия: " + this.state.license_data[1].name}>
                  <Input
                    type="text"
                    placeholder="Ссылка на товар"
                    maxLength="200"
                    value={this.state.licenses1}
                    onChange={(e) => {
                      this.setState({
                        licenses1: e.target.value
                          .replace(/[@+#+*+?+&+%+,++]/gi, "")
                          .replace(/\n/, "")
                          .replace(/^\s+/g, ""),
                      });
                    }}
                  />
                </FormItem>
              )}
              {this.state.license_data[2] !== undefined && (
                <FormItem top={"Лицензия: " + this.state.license_data[2].name}>
                  <Input
                    type="text"
                    placeholder="Ссылка на товар"
                    maxLength="200"
                    value={this.state.licenses2}
                    onChange={(e) => {
                      this.setState({
                        licenses2: e.target.value
                          .replace(/[@+#+*+?+&+%+,++]/gi, "")
                          .replace(/\n/, "")
                          .replace(/^\s+/g, ""),
                      });
                    }}
                  />
                </FormItem>
              )}
              {this.state.license_data[3] !== undefined && (
                <FormItem top={"Лицензия: " + this.state.license_data[3].name}>
                  <Input
                    placeholder="Ссылка на товар"
                    maxLength="200"
                    value={this.state.licenses3}
                    onChange={(e) => {
                      this.setState({
                        licenses3: e.target.value
                          .replace(/[@+#+*+?+&+%+,++]/gi, "")
                          .replace(/\n/, "")
                          .replace(/^\s+/g, ""),
                      });
                    }}
                  />
                </FormItem>
              )}
              {this.state.license_data[4] !== undefined && (
                <FormItem top={"Лицензия: " + this.state.license_data[4].name}>
                  <Input
                    type="text"
                    placeholder="Ссылка на товар"
                    maxLength="200"
                    value={this.state.licenses4}
                    onChange={(e) => {
                      this.setState({
                        licenses4: e.target.value
                          .replace(/[@+#+*+?+&+%+,++]/gi, "")
                          .replace(/\n/, "")
                          .replace(/^\s+/g, ""),
                      });
                    }}
                  />
                </FormItem>
              )}
              {this.state.license_data[5] !== undefined && (
                <FormItem top={"Лицензия: " + this.state.license_data[5].name}>
                  <Input
                    type="text"
                    placeholder="Ссылка на товар"
                    maxLength="200"
                    value={this.state.licenses5}
                    onChange={(e) => {
                      this.setState({
                        licenses5: e.target.value
                          .replace(/[@+#+*+?+&+%+,++]/gi, "")
                          .replace(/\n/, "")
                          .replace(/^\s+/g, ""),
                      });
                    }}
                  />
                </FormItem>
              )}
              {this.state.license_data[6] !== undefined && (
                <FormItem top={"Лицензия: " + this.state.license_data[6].name}>
                  <Input
                    type="text"
                    placeholder="Ссылка на товар"
                    maxLength="200"
                    value={this.state.licenses6}
                    onChange={(e) => {
                      this.setState({
                        licenses6: e.target.value
                          .replace(/[@+#+*+?+&+%+,++]/gi, "")
                          .replace(/\n/, "")
                          .replace(/^\s+/g, ""),
                      });
                    }}
                  />
                </FormItem>
              )}
              {this.state.license_data[7] !== undefined && (
                <FormItem top={"Лицензия: " + this.state.license_data[7].name}>
                  <Input
                    type="text"
                    placeholder="Ссылка на товар"
                    maxLength="200"
                    value={this.state.licenses7}
                    onChange={(e) => {
                      this.setState({
                        licenses7: e.target.value
                          .replace(/[@+#+*+?+&+%+,++]/gi, "")
                          .replace(/\n/, "")
                          .replace(/^\s+/g, ""),
                      });
                    }}
                  />
                </FormItem>
              )}
              {this.state.license_data[8] !== undefined && (
                <FormItem top={"Лицензия: " + this.state.license_data[8].name}>
                  <Input
                    type="text"
                    placeholder="Ссылка на товар"
                    maxLength="200"
                    value={this.state.licenses8}
                    onChange={(e) => {
                      this.setState({
                        licenses8: e.target.value
                          .replace(/[@+#+*+?+&+%+,++]/gi, "")
                          .replace(/\n/, "")
                          .replace(/^\s+/g, ""),
                      });
                    }}
                  />
                </FormItem>
              )}
              {this.state.license_data[9] !== undefined && (
                <FormItem top={"Лицензия: " + this.state.license_data[9].name}>
                  <Input
                    type="text"
                    placeholder="Ссылка на товар"
                    maxLength="200"
                    value={this.state.licenses9}
                    onChange={(e) => {
                      this.setState({
                        licenses9: e.target.value
                          .replace(/[@+#+*+?+&+%+,++]/gi, "")
                          .replace(/\n/, "")
                          .replace(/^\s+/g, ""),
                      });
                    }}
                  />
                </FormItem>
              )}
              <Div>
                <Button
                  onClick={this.props.clickOnLink()}
                  stretched
                  mode="secondary"
                  className="fixButton"
                  size="l"
                  disabled={
                    this.state.good_name === "" || this.state.disabled === true
                      ? true
                      : false
                  }
                >
                  Сохранить
                </Button>
              </Div>
            </FormLayout>
          </Group>
        )}
        {this.props.snackbar}
      </Panel>
    );
  }
}

export default Settings;
