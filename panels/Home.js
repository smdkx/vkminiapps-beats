import React from "react";
import queryString from "query-string";
import {
  PanelHeader,
  Panel,
  Div,
  Alert,
  Placeholder,
  Button,
  Footer,
  PanelHeaderButton,
  HorizontalCell,
  Avatar,
  Group,
} from "@vkontakte/vkui";
import { Icon56UsersOutline, Icon28HelpCircleOutline } from "@vkontakte/icons";

import fetch2 from "../components/Fetch";

import icon1_white from "../img/icon1_white.webp";
import icon1_black from "../img/icon1_black.webp";
import icon2_white from "../img/icon2_white.webp";
import icon2_black from "../img/icon2_black.webp";
import icon3_white from "../img/icon3_white.webp";
import icon3_black from "../img/icon3_black.webp";
import icon4_white from "../img/icon4_white.webp";
import icon4_black from "../img/icon4_black.webp";
import icon5_white from "../img/icon5_white.webp";
import icon5_black from "../img/icon5_black.webp";

import banner_white from "../img/banner_white.webp";
import banner_black from "../img/banner_black.webp";

import pro_1 from "../img/pro_1.webp";
import pro_0 from "../img/pro_0.webp";

/*eslint eqeqeq: "off"*/

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      userdata: {
        user_id: null,
        group_id: null,
        pro: null,
      },
    };
    this.openAction = this.openAction.bind(this);
    this.uninstallAppInCommunity = this.uninstallAppInCommunity.bind(this);
  }

  componentDidMount() {
    this.props.setSpinner(true);
    fetch2("initApp").then((data) => {
      if (data.result === "flood")
        this.props.setSnackbar(
          "Ох, флуд-контроль! Перезайдите в приложение через несколько секунд...",
          3000,
          false
        );
      else
        this.setState({
          userdata: {
            user_id: data.result[0].user_id,
            group_id: data.result[0].group_id,
            pro: data.result[0].pro,
          },
          loaded: true,
        });
      this.props.setSpinner(false);
    });
  }

  uninstallAppInCommunity() {
    this.props.setSpinner(true);
    fetch2("uninstallAppInCommunity").then((data) => {
      if (data.result === "ok") {
        this.props.setTextpage(
          "Сообщество отключено!",
          "Вы успешно отключили сообщество от сервиса. Биты и лицензии были автоматически удалены.",
          "Принято!",
          true
        );
        this.props.setSpinner(false);
      }
      if (data.result === "flood")
        this.props.setSnackbar(
          "Ох, флуд-контроль! Попробуйте еще раз через несколько секунд...",
          3000,
          false
        );
      this.props.setSpinner(false);
    });
  }

  openAction() {
    this.props.setCustomAlert(
      <Alert
        actions={[
          {
            title: "Да, отключить",
            mode: "destructive",
            autoclose: true,
            action: () => this.uninstallAppInCommunity(),
          },
          {
            title: "Отмена",
            autoclose: true,
            mode: "cancel",
          },
        ]}
        actionsLayout="vertical"
        onClose={() => this.props.setCustomAlert(null)}
        header="Подтвердите действие"
        text="Вы уверены, что хотите отключить сообщество от сервиса? После отключения все биты и лицензии будут удалены."
      />
    );
  }

  render() {
    let { id, snackbar } = this.props;
    return (
      <Panel id={id} className="homePageMain" centered="true">
        <PanelHeader
          style={{ zIndex: 0 }}
          separator={false}
          left={
            <PanelHeaderButton onClick={() => this.props.go("faq")}>
              <Icon28HelpCircleOutline />
            </PanelHeaderButton>
          }
        >
          Beat Store
        </PanelHeader>
        {this.props.spinner === false && this.state.loaded === true && (
          <Group>
            {this.state.userdata.group_id === null && (
              <Group>
                <Placeholder
                  icon={<Icon56UsersOutline />}
                  header="Ну что, начнём?"
                  action={
                    <Button
                      onClick={() => {
                        this.props.clickOnLink();
                        this.props.setActiveModal("add1");
                      }}
                      size="m"
                    >
                      Начать установку
                    </Button>
                  }
                >
                  Подключите сообщество, в котором Вы хотите продавать биты.
                </Placeholder>
              </Group>
            )}
            {this.state.userdata.group_id !== null &&
              this.props.user !== undefined && (
                <Group>
                  <Placeholder
                    icon={
                      this.props.theme !== "space_gray" ? (
                        <img
                          alt="баннер beat store (белая версия)"
                          src={banner_white}
                          style={{ width: 200, height: 100 }}
                        />
                      ) : (
                        <img
                          alt="баннер beat store (чёрная версия)"
                          src={banner_black}
                          style={{ width: 200, height: 100 }}
                        />
                      )
                    }
                    header={
                      <span>
                        Приветствую,{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: this.props.user.first_name,
                          }}
                        />
                        !
                      </span>
                    }
                    action={
                      <div style={{ marginTop: -15 }}>
                        {this.props.theme === "space_gray" && (
                          <div>
                            <Div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <HorizontalCell
                                disabled
                                size="s"
                                className="tap"
                                header="Биты"
                                onClick={() => {
                                  this.props.clickOnLink();
                                  this.props.go("goods");
                                }}
                              >
                                <Avatar
                                  size={64}
                                  mode="app"
                                  src={icon1_white}
                                />
                              </HorizontalCell>
                              <HorizontalCell
                                disabled
                                size="s"
                                className="tap"
                                header="Лицензии"
                                onClick={() => {
                                  this.props.clickOnLink();
                                  this.props.go("licenses");
                                }}
                              >
                                <Avatar
                                  size={64}
                                  mode="app"
                                  src={icon2_white}
                                />
                              </HorizontalCell>
                              <HorizontalCell
                                disabled
                                size="s"
                                className="tap"
                                header="Обложка"
                                onClick={() => {
                                  this.props.clickOnLink();
                                  this.props.go("cover");
                                }}
                              >
                                <Avatar
                                  size={64}
                                  mode="app"
                                  src={icon3_white}
                                />
                              </HorizontalCell>
                            </Div>
                            <Div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: -20,
                              }}
                            >
                              {this.state.userdata.pro == 0 ? (
                                <HorizontalCell
                                  disabled
                                  size="s"
                                  className="tap"
                                  header="Режим PRO"
                                  onClick={() => {
                                    this.props.clickOnLink();
                                  }}
                                >
                                  <a
                                    rel="noreferrer"
                                    href="https://vk.com/trestahouse?source=description&w=donut_payment-89261278"
                                    target="_blank"
                                  >
                                    <Avatar size={64} mode="app" src={pro_0} />
                                  </a>
                                </HorizontalCell>
                              ) : (
                                <HorizontalCell
                                  disabled
                                  size="s"
                                  className="tap"
                                  header="Режим PRO"
                                  onClick={() => {
                                    this.props.clickOnLink();
                                    this.props.setSnackbar(
                                      "Режим PRO активен! Спасибо, что Вы используете наш сервис ❤",
                                      3000,
                                      true
                                    );
                                  }}
                                >
                                  <Avatar size={64} mode="app" src={pro_1} />
                                </HorizontalCell>
                              )}
                              <HorizontalCell
                                disabled
                                size="s"
                                className="tap"
                                header="Драм киты"
                                onClick={() => {
                                  this.props.clickOnLink();
                                  if (this.state.userdata.pro == 0)
                                    this.props.setAlert(
                                      "Уведомление",
                                      "К сожалению, этот раздел доступен лишь пользователям PRO режима."
                                    );
                                  else this.props.go("drumkits");
                                }}
                              >
                                <Avatar
                                  size={64}
                                  mode="app"
                                  src={icon5_white}
                                />
                              </HorizontalCell>
                              {queryString.parse(window.location.search)
                                .vk_group_id !== undefined && (
                                <HorizontalCell
                                  disabled
                                  size="s"
                                  className="tap"
                                  header="В магазин"
                                  onClick={() => {
                                    this.props.clickOnLink();
                                    this.props.go("userpage");
                                  }}
                                >
                                  <Avatar
                                    size={64}
                                    mode="app"
                                    src={icon4_white}
                                  />
                                </HorizontalCell>
                              )}
                            </Div>
                          </div>
                        )}
                        {this.props.theme === "bright_light" && (
                          <div>
                            <Div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <HorizontalCell
                                disabled
                                size="s"
                                className="tap"
                                header="Биты"
                                onClick={() => {
                                  this.props.clickOnLink();
                                  this.props.go("goods");
                                }}
                              >
                                <Avatar
                                  size={64}
                                  mode="app"
                                  src={icon1_black}
                                />
                              </HorizontalCell>
                              <HorizontalCell
                                disabled
                                size="s"
                                className="tap"
                                header="Лицензии"
                                onClick={() => {
                                  this.props.clickOnLink();
                                  this.props.go("licenses");
                                }}
                              >
                                <Avatar
                                  size={64}
                                  mode="app"
                                  src={icon2_black}
                                />
                              </HorizontalCell>
                              <HorizontalCell
                                disabled
                                size="s"
                                className="tap"
                                header="Обложка"
                                onClick={() => {
                                  this.props.clickOnLink();
                                  this.props.go("cover");
                                }}
                              >
                                <Avatar
                                  size={64}
                                  mode="app"
                                  src={icon3_black}
                                />
                              </HorizontalCell>
                            </Div>
                            <Div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: -20,
                              }}
                            >
                              {this.state.userdata.pro == 0 ? (
                                <HorizontalCell
                                  disabled
                                  size="s"
                                  className="tap"
                                  header="Режим PRO"
                                  onClick={() => {
                                    this.props.clickOnLink();
                                  }}
                                >
                                  <a
                                    rel="noreferrer"
                                    href="https://vk.com/trestahouse?source=description&w=donut_payment-89261278"
                                    target="_blank"
                                  >
                                    <Avatar size={64} mode="app" src={pro_0} />
                                  </a>
                                </HorizontalCell>
                              ) : (
                                <HorizontalCell
                                  disabled
                                  size="s"
                                  className="tap"
                                  header="Режим PRO"
                                  onClick={() => {
                                    this.props.clickOnLink();
                                    this.props.setSnackbar(
                                      "Режим PRO активен! Спасибо, что Вы используете наш сервис ❤",
                                      3000,
                                      true
                                    );
                                  }}
                                >
                                  <Avatar size={64} mode="app" src={pro_1} />
                                </HorizontalCell>
                              )}
                              <HorizontalCell
                                disabled
                                size="s"
                                className="tap"
                                header="Драм киты"
                                onClick={() => {
                                  this.props.clickOnLink();
                                  if (this.state.userdata.pro == 0)
                                    this.props.setAlert(
                                      "Уведомление",
                                      "К сожалению, этот раздел доступен лишь пользователям PRO режима."
                                    );
                                  else this.props.go("drumkits");
                                }}
                              >
                                <Avatar
                                  size={64}
                                  mode="app"
                                  src={icon5_black}
                                />
                              </HorizontalCell>
                              {queryString.parse(window.location.search)
                                .vk_group_id !== undefined && (
                                <HorizontalCell
                                  disabled
                                  size="s"
                                  className="tap"
                                  header="В магазин"
                                  onClick={() => {
                                    this.props.clickOnLink();
                                    this.props.go("userpage");
                                  }}
                                >
                                  <Avatar
                                    size={64}
                                    mode="app"
                                    src={icon4_black}
                                  />
                                </HorizontalCell>
                              )}
                            </Div>
                          </div>
                        )}
                      </div>
                    }
                  >
                    Вы в главном меню сервиса. Чтобы перейти в тот или иной
                    раздел, нажмите на одну из кнопок ниже.
                  </Placeholder>
                  <Footer style={{ marginTop: -30 }}>
                    Подключена группа:{" "}
                    <a
                      rel="noreferrer"
                      href={
                        "https://vk.com/club" + this.state.userdata.group_id
                      }
                      target="_blank"
                      onClick={this.props.clickOnLink()}
                    >
                      {this.state.userdata.group_id}
                    </a>
                    .
                    <br />
                    <span
                      className="tap defaultLinkColor"
                      onClick={() => {
                        this.openAction();
                        this.props.clickOnLink();
                      }}
                    >
                      Отключить группу
                    </span>
                  </Footer>
                </Group>
              )}
          </Group>
        )}
        {snackbar}
      </Panel>
    );
  }
}

export default Home;
