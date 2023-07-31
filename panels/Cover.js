import React from "react";
import {
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Group,
  Header,
  Card,
  Text,
  Title,
  Div,
  File,
} from "@vkontakte/vkui";

import fetch2 from "../components/Fetch";
import axios from "axios";

/*eslint eqeqeq: "off"*/

class Cover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      selectedFile: null,
      pro: 0,
    };
  }

  componentDidMount() {
    fetch2("initBannerPage").then((data) => {
      if (data.result !== "error")
        this.setState({
          banner: data.result.banner,
          pro: data.result.pro,
          loaded: true,
        });
      else {
        this.props.setSnackbar("Упс, что-то пошло не так...", 3000, false);
        this.props.go();
      }
    });
  }

  render() {
    let { id, go } = this.props;
    return (
      <Panel id={id}>
        <PanelHeader
          separator={false}
          left={<PanelHeaderBack onClick={() => go("home")} />}
        >
          Обложка
        </PanelHeader>
        {this.state.loaded === true && (
          <Group
            header={
              <Header mode="secondary">Текущая обложка (1280 x 435)</Header>
            }
          >
            {this.state.pro == 0 && (
              <Div style={{ marginTop: -20 }}>
                <Card>
                  <Div>
                    <Title level="2" style={{ paddingBottom: 5 }}>
                      Ах-ох! Вы не PRO!
                    </Title>
                    <Text>
                      К сожалению, смена обложки доступна только пользователям с
                      режимом PRO. Оформите подписку в главном меню и
                      возвращайтесь!
                    </Text>
                  </Div>
                </Card>
              </Div>
            )}
            <Div style={{ marginTop: -15 }}>
              <Card style={{ background: "none" }}>
                <img
                  alt="баннер магазина"
                  className="banner"
                  style={{ width: "100%", borderRadius: 3 }}
                  src={this.state.banner}
                />
              </Card>
              <File
                style={{ width: "100%", marginTop: 5 }}
                accept="image/x-png,image/png,image/jpeg,image/gif"
                disabled={
                  this.state.pro == 0 || this.state.selectedFile !== null
                    ? true
                    : false
                }
                controlSize="l"
                onChange={(e) => {
                  e.preventDefault();
                  if (e.target.files[0].size < 10000000) {
                    this.setState({
                      selectedFile: e.target.files[0],
                    });
                    var data = new FormData();
                    data.append(
                      "image",
                      e.target.files[0],
                      e.target.files[0].name
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
                              "Мы не смогли обновить обложку, так как для загрузки доступны лишь файлы типа png и jpg."
                            );
                            this.setState({
                              selectedFile: null,
                            });
                          } else {
                            this.setState({
                              banner:
                                "https://cloud.trestahouse.com/drive1/" +
                                data.data.result,
                              selectedFile: null,
                            });
                            fetch2(
                              "updateBanner",
                              "banner=" + data.data.result
                            ).then((data) => {
                              if (data.result === "ok")
                                this.props.setSnackbar(
                                  "Обложка успешно обновлена!",
                                  3000,
                                  true
                                );
                            });
                          }
                        }
                      })
                      .catch(() => {
                        this.props.setAlert(
                          "Отчёт об ошибке",
                          "Мы не смогли загрузить обложку, так как не удалось отправить её на сервер."
                        );
                        this.setState({
                          selectedFile: null,
                        });
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
                mode="outline"
              >
                {this.state.selectedFile !== null
                  ? "Обновляем..."
                  : this.state.pro == 0
                  ? "Обновить обложку (недоступно)"
                  : "Обновить обложку"}
              </File>
            </Div>
          </Group>
        )}
        {this.props.snackbar}
      </Panel>
    );
  }
}

export default Cover;
