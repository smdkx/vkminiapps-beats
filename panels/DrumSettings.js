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
  Textarea,
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

class DrumSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      snackbar: null,
      name: "",
      description: "",
      image: "",
      sent: false,
      track: "",
      files: "",
      price: "",
      uploaded_photo: false,
      uploaded_doc: false,
      selectedFile: null,
      selectedFile2: null,
    };
    this.sendForm = this.sendForm.bind(this);
    this.validate = this.validate.bind(this);
  }

  componentDidMount() {
    this.props.setSpinner(true);
    fetch2("getDrumKitInfo", "id=" + this.props.drum_id).then((data) => {
      this.setState({
        name: data.result.name,
        description: data.result.description.replace(/<>/gi, "\n"),
        image: data.result.image,
        track: data.result.track,
        files: data.result.files,
        price: data.result.price,
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
        "Во всех полях для ввода лицензии может быть указан только URL-адрес. В ином случае сохранить драм кит не получится."
      );
      this.props.setSpinner(false);
      return false;
    }
  }

  sendForm() {
    if (this.validate(this.state.files) !== false) {
      fetch2(
        "editDrumKit",
        "id=" +
          this.props.drum_id +
          "&name=" +
          encodeURI(this.state.name) +
          "&track=" +
          encodeURI(this.state.track) +
          "&image=" +
          encodeURI(this.state.image) +
          "&description=" +
          encodeURI(this.state.description) +
          "&price=" +
          encodeURI(this.state.price) +
          "&files=" +
          encodeURI(this.state.files)
      )
        .then((data) => {
          if (data.result === "ok") {
            this.props.setSnackbar("Драм кит успешно изменен!", 3000, true);
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
                  this.state.name !== "" &&
                  this.state.description !== "" &&
                  this.state.price !== 0 &&
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
                                "Мы не смогли изменить обложку, так как для загрузки доступны лишь файлы типа png и jpg, а также gif."
                              );
                              this.setState({
                                selectedFile2: null,
                              });
                              this.props.setSpinner(false);
                            } else {
                              this.setState({
                                image:
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
                                "Мы не смогли изменить трек, так как для загрузки доступны лишь аудиофайлы типа mp3, wav, ogg."
                              );
                              this.setState({
                                selectedFile2: null,
                              });
                              this.props.setSpinner(false);
                            } else {
                              this.setState({
                                track:
                                  "https://cloud.trestahouse.com/drive1/" +
                                  data.data.result,
                                uploaded_doc: true,
                              });
                              if (
                                this.state.selectedFile === null ||
                                (this.state.selectedFile !== null &&
                                  this.state.uploaded_photo === true &&
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
                  } else {
                    this.sendForm();
                  }
                }
              }}
            >
              <FormLayoutGroup mode="horizontal">
                <FormItem top="Наименование">
                  <Input
                    type="text"
                    name="name"
                    placeholder="Клава Кока - Покинула чат"
                    maxLength="50"
                    value={this.state.name}
                    onChange={(e) => {
                      this.setState({
                        name: e.target.value
                          .replace(/[@+#+*+?+&+%+,++]/gi, "")
                          .replace(/\n/, "")
                          .replace(/^\s+/g, ""),
                      });
                    }}
                  />
                </FormItem>
                <FormItem top="Стоимость">
                  <Input
                    inputMode="numeric"
                    placeholder="990"
                    name="price"
                    value={this.state.price}
                    maxLength="6"
                    onChange={(e) => {
                      this.setState({
                        price: e.target.value
                          .replace(/\D+/g, "")
                          .replace(/^0+/, ""),
                      });
                    }}
                  />
                </FormItem>
              </FormLayoutGroup>
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
              <FormItem top="Ссылка на товар (облако)">
                <Input
                  type="text"
                  placeholder="Ссылка на товар"
                  maxLength="200"
                  value={this.state.files}
                  onChange={(e) => {
                    this.setState({
                      files: e.target.value
                        .replace(/[@+#+*+?+&+%+,++]/gi, "")
                        .replace(/\n/, "")
                        .replace(/^\s+/g, ""),
                    });
                  }}
                />
              </FormItem>
              <FormItem top="Описание (до 300 символов)">
                <Textarea
                  placeholder="Какое-то описание драм кита..."
                  style={{ resize: "none" }}
                  value={this.state.description}
                  maxLength="300"
                  wrap="soft"
                  onChange={(e) => {
                    this.setState({
                      description: e.target.value
                        .replace(/[@+#+*+?+&+%++]/gi, "")
                        .replace(/^\s+/g, ""),
                    });
                  }}
                />
              </FormItem>
              <Div>
                <Button
                  onClick={this.props.clickOnLink()}
                  stretched
                  mode="secondary"
                  className="fixButton"
                  size="l"
                  disabled={
                    this.state.name === "" ||
                    this.state.files === "" ||
                    this.state.price === "" ||
                    this.state.description === "" ||
                    this.state.disabled === true
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

export default DrumSettings;
