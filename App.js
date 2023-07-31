import React from "react";
import bridge from "@vkontakte/vk-bridge";
import { platform } from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import AudioPlayer from "react-h5-audio-player";
import axios from "axios";
import queryString from "query-string";
import {
  View,
  Snackbar,
  FormLayout,
  FormItem,
  Input,
  Textarea,
  Checkbox,
  Avatar,
  FormLayoutGroup,
  ConfigProvider,
  Group,
  ModalPage,
  Alert,
  Button,
  Div,
  ModalRoot,
  ModalPageHeader,
  NativeSelect,
  ModalCard,
  File,
  ScreenSpinner,
} from "@vkontakte/vkui";

import {
  Icon56ErrorOutline,
  Icon56UsersOutline,
  Icon28CancelCircleFillRed,
  Icon28CheckCircleFill,
  Icon24Camera,
  Icon24DoneOutline,
  Icon24VolumeOutline,
} from "@vkontakte/icons";

import "./css/Index.css";

/*eslint eqeqeq: "off"*/

import fetch2 from "./components/Fetch";

import Home from "./panels/Home";
import Offline from "./panels/Offline";
import Textpage from "./panels/Textpage";
import Goods from "./panels/Goods";
import Licenses from "./panels/Licenses";
import Settings from "./panels/Settings";
import UserPage from "./panels/UserPage";
import Contract from "./panels/Contract";
import Cover from "./panels/Cover";
import FAQ from "./panels/FAQ";
import DrumKits from "./panels/DrumKits";
import DrumSettings from "./panels/DrumSettings";

const ROUTES = {
  HOME: "home",
  OFFLINE: "offline",
  TEXTPAGE: "textpage",
  GOODS: "goods",
  LICENSES: "licenses",
  SETTINGS: "settings",
  USERPAGE: "userpage",
  CONTRACT: "contract",
  COVER: "cover",
  DRUMKITS: "drumkits",
  DRUMSETTINGS: "drumsettings",
  FAQ: "faq",
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePanel: ROUTES.HOME,
      theme: "client_light",
      snackbar: null,
      loaded: false,
      online: true,
      spinner: false,
      blockSend: false,
      popout: null,
      popular: 0,
      disabled: false,
      optionValue: "",
      history: ["home"],
      group_id: "",
      data: null,
      admin: false,
      selectData: null,
      price: null,
      activeModal: null,
      textpage: {
        title: null,
        text: null,
        button: null,
        success: true,
      },
      licenseID: "",
      license_name: "",
      license_price: "",
      license_description: "",
      good_name: "",
      good_image: "",
      drumkit_description: "",
      drumkit_price: 0,
      good_track: "",
      id: 0,
      selectedFile: null,
      selectedFile2: null,
    };
    this.go = this.go.bind(this);
    this.goBack = this.goBack.bind(this);
    this.AndroidBackButton = this.AndroidBackButton.bind(this);
    this.clickOnLink = this.clickOnLink.bind(this);
    this.setActiveModal = this.setActiveModal.bind(this);
    this.setSnackbar = this.setSnackbar.bind(this);
    this.setTextpage = this.setTextpage.bind(this);
    this.blockButton = this.blockButton.bind(this);
    this.setAlert = this.setAlert.bind(this);
    this.setCustomAlert = this.setCustomAlert.bind(this);
    this.setSpinner = this.setSpinner.bind(this);
  }

  componentDidMount() {
    bridge.subscribe(({ detail: { type, data } }) => {
      if (type === "VKWebAppUpdateConfig") {
        const schemeAttribute = document.createAttribute("scheme");
        schemeAttribute.value = data.scheme ? data.scheme : "client_light";
        this.setState({ theme: data.scheme });
        document.body.attributes.setNamedItem(schemeAttribute);
      }
    });

    bridge.send("VKWebAppGetUserInfo").then((data) => {
      this.setState({ user: data });
    });

    window.addEventListener("popstate", this.AndroidBackButton);

    if (
      new URLSearchParams(window.location.search).get("vk_group_id") !== null
    ) {
      this.go("userpage");
    }

    window.addEventListener("offline", () => {
      this.setActiveModal();
      this.setState({
        online: false,
        popout: null,
      });
      document.body.style.overflow = "hidden";
      this.go("offline");
    });

    window.addEventListener("online", () => {
      this.setState({
        online: true,
        popout: null,
      });
      document.body.style.overflow = "visible";
      this.go("home");
    });

    if (
      new URLSearchParams(window.location.search).get("vk_group_id") === null
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
    this.setState({ loaded: true });
  }

  blockButton(timeout = 2000) {
    this.setState({ disabled: true });
    setTimeout(() => {
      this.setState({ disabled: false });
    }, timeout);
  }

  setSpinner(action) {
    this.setState({ spinner: action });
  }

  setSnackbar(text, duration, success) {
    duration = duration || 4000;
    if (success === true) success = <Icon28CheckCircleFill />;
    else success = <Icon28CancelCircleFillRed />;
    this.setState({
      snackbar: (
        <Snackbar
          layout="vertical"
          before={success}
          duration={duration}
          onClose={() => this.setState({ snackbar: null })}
        >
          {text}
        </Snackbar>
      ),
    });
  }

  setTextpage(title, text, button, success) {
    if (success === undefined) success = true;
    this.setState({
      textpage: {
        title: title,
        text: text,
        button: button,
        success: success,
      },
    });
    this.go("textpage");
    document.body.style.overflow = "visible";
  }

  setActiveModal(
    activeModal = null,
    editLicenseData = null,
    userData = null,
    id = null
  ) {
    let modalHistory = this.state.modalHistory
      ? [...this.state.modalHistory]
      : [];
    if (editLicenseData !== null)
      this.setState({
        license_name: editLicenseData.license_name,
        license_description: editLicenseData.license_description,
        license_price: editLicenseData.license_price,
        id: editLicenseData.id,
        popular: editLicenseData.popular,
      });
    if (id !== null) this.setState({ id: id });
    if (userData !== null)
      this.setState({
        good_name: userData.good_name,
        good_image: userData.good_image,
        good_track: userData.good_track,
        group_id: userData.group_id,
        admin: userData.admin,
        drumkit_description: userData.drumkit_description,
        drumkit_price: userData.drumkit_price,
      });
    if (activeModal === null) {
      document.body.style.overflow = "visible";
      modalHistory = [];
      this.setState({ optionValue: "", price: null });
    } else if (modalHistory.indexOf(activeModal) !== -1) {
      modalHistory = modalHistory.splice(
        0,
        modalHistory.indexOf(activeModal) + 1
      );
    } else {
      document.body.style.overflow = "hidden";
      modalHistory.push(activeModal);
    }
    this.setState({
      activeModal,
      modalHistory,
    });
  }

  go(panel, id = null) {
    if (this.state.online === true) {
      this.setActiveModal(null);
      const history = [...this.state.history];
      history.push(panel);
      this.setState({
        good_name: "",
        good_image: "",
        good_track: "",
        group_id: "",
        selectedFile: null,
        selectedFile2: null,
      });
      if (id !== null) this.setState({ id: id });
      if (
        (panel === "home" && this.state.activePanel !== "userpage") ||
        (panel === "userpage" && this.state.history.includes("home"))
      ) {
        if (panel === "userpage") document.body.style.overflow = "visible";
        else document.body.style.overflow = "hidden";
        bridge.send("VKWebAppDisableSwipeBack");
        this.setState({
          history: [panel],
          activePanel: panel,
        });
      } else {
        if (panel === "home" || panel === "cover")
          document.body.style.overflow = "hidden";
        else document.body.style.overflow = "visible";
        if (
          panel == "home" &&
          new URLSearchParams(window.location.search).get("vk_group_id") !==
            null
        ) {
          this.setState({
            history: ["home"],
            activePanel: panel,
          });
        } else
          this.setState({
            history: history,
            activePanel: panel,
          });
      }
    } else {
      this.setState({
        activePanel: panel,
        history: ["home"],
      });
    }
  }

  goBack = () => {
    if (this.state.activeModal !== null) this.setActiveModal(null);
    const history = [...this.state.history];
    history.pop();
    const activePanel = history[history.length - 1];
    if (activePanel === "home") {
      document.body.style.overflow = "hidden";
      bridge.send("VKWebAppEnableSwipeBack");
    } else {
      document.body.style.overflow = "visible";
    }
    this.setState({ history: history, activePanel });
  };

  AndroidBackButton = () => {
    if (
      ((this.state.activePanel !== "home" &&
        this.state.activePanel !== "userpage") ||
        (this.state.history !== ["userpage"] &&
          this.state.activePanel !== "userpage")) &&
      this.state.history.length !== 1 &&
      this.state.online === true
    ) {
      if (this.state.activeModal !== null || this.state.popout !== null) {
        this.setActiveModal(null);
        this.setState({ popout: null });
      } else {
        setTimeout(() => {
          this.goBack();
        }, 100);
      }
    } else {
      if (this.state.activeModal !== null) {
        this.setActiveModal(null);
      } else {
        bridge.send("VKWebAppClose", { status: "success" });
      }
    }
  };

  setCustomAlert(data) {
    this.setState({ popout: data });
  }

  setAlert(title, text) {
    this.setState({
      popout: (
        <Alert
          actions={[
            {
              title: "Принято",
              autoclose: true,
              mode: "cancel",
            },
          ]}
          actionsLayout="vertical"
          onClose={() => this.setState({ popout: null })}
          header={title}
          text={text}
        />
      ),
    });
  }

  clickOnLink() {
    document.body.style.pointerEvents = "none";
    setTimeout(() => {
      document.body.style.pointerEvents = "all";
    }, 100);
  }

  render() {
    const modal = (
      <ModalRoot activeModal={this.state.activeModal}>
        <ModalCard
          id="buy"
          onClose={() => {
            this.setActiveModal(null);
          }}
          icon={<Avatar mode="app" src={this.state.good_image} size={64} />}
          header={this.state.good_name}
          subheader={
            <AudioPlayer
              autoPlay
              src={this.state.good_track}
              volume="0.3"
              showJumpControls="false"
            />
          }
          actions={
            <Button
              size="l"
              mode="primary"
              onClick={() => {
                let arr = [];
                fetch2("getLicensesUserPage").then((data) => {
                  data.result.forEach((el) => {
                    let popular = "";
                    if (el.popular == 1) popular = "⭐";
                    arr.push(
                      <option
                        value={[
                          el.id +
                            "#" +
                            el.description.replace(/<>/gi, "\n") +
                            "#" +
                            el.price,
                        ]}
                      >
                        {popular} {el.name + " — " + el.price + " руб"}
                      </option>
                    );
                  });
                  this.setState({ selectData: arr });
                  this.setActiveModal("buy2");
                  this.clickOnLink();
                });
              }}
            >
              Приобрести
            </Button>
          }
        />

        <ModalCard
          id="buy2"
          onClose={() => {
            this.setActiveModal(null);
          }}
          icon={<Avatar mode="app" src={this.state.good_image} size={64} />}
          header={this.state.good_name}
          className="tw"
          subheader={
            <div>
              {this.state.description}
              <FormItem style={{ textAlign: "left" }}>
                <NativeSelect
                  required
                  placeholder="Выберите тип лицензии"
                  value={this.state.optionValue}
                  onChange={(e) => {
                    this.setState({
                      description: e.target.value.split("#")[1],
                      price: e.target.value.split("#")[2],
                      licenseID: e.target.value.split("#")[0],
                      optionValue: e.target.value,
                    });
                  }}
                >
                  {this.state.selectData}
                </NativeSelect>
              </FormItem>
            </div>
          }
          actions={
            <Button
              style={{ marginTop: -30, width: "96%" }}
              size="l"
              mode="commerce"
              disabled={
                this.state.admin === true ||
                this.state.price === null ||
                this.state.optionValue === ""
                  ? true
                  : false
              }
              onClick={() => {
                this.clickOnLink();
                this.setActiveModal("confirmPayment");
              }}
            >
              {this.state.admin === true
                ? "Отключено для админов"
                : "Приобрести"}
            </Button>
          }
        />

        <ModalCard
          id="confirmPayment"
          onClose={() => {
            this.setActiveModal("buy2");
          }}
          icon={<Icon56ErrorOutline />}
          header="Обратите внимание!"
          subheader={
            "Пожалуйста, не меняйте комментарий к переводу. В нём содержится код, который нам необходим."
          }
          actions={
            <div style={{ display: "flex", width: "100%" }}>
              <Button
                size="l"
                stretched
                mode="destructive"
                onClick={() => {
                  this.clickOnLink();
                  this.setActiveModal("buy2");
                }}
              >
                Назад
              </Button>
              <Button
                size="l"
                mode="commerce"
                stretched
                onClick={() => {
                  let desc =
                    "Покупка: " +
                    this.state.good_name +
                    " (код: " +
                    queryString.parse(window.location.search).sign.substr(-5) +
                    ")";
                  setTimeout(() => {
                    bridge
                      .send("VKWebAppOpenPayForm", {
                        app_id: 7832713,
                        action: "pay-to-group",
                        params: {
                          group_id: Number(this.state.group_id),
                          amount: Number(this.state.price),
                          description: desc,
                        },
                      })
                      .then((data) => {
                        this.setState({ spinner: true });
                        this.setActiveModal();
                        fetch2(
                          "verifyPayment",
                          "transaction_id=" +
                            data.transaction_id +
                            "&item_id=" +
                            this.state.id +
                            "&license_id=" +
                            this.state.licenseID
                        )
                          .then((data) => {
                            if (data.result === "ok") {
                              this.setState({ spinner: false });
                              this.setTextpage(
                                "Оплата прошла успешно!",
                                "Покупка осуществлена. Чтобы получить оплаченный товар, перейдите во вкладку 'Мои покупки'.",
                                "Принято!",
                                true
                              );
                              this.clickOnLink();
                            } else {
                              this.setState({ spinner: false });
                              this.setTextpage(
                                "Оуч! Что произошло?",
                                "К сожалению, мы не смогли проверить Ваш платёж.",
                                "Хорошо!",
                                false
                              );
                              this.clickOnLink();
                            }
                          })
                          .catch(() => {
                            this.setState({ spinner: false });
                            this.setTextpage(
                              "Оуч! Что произошло?",
                              "К сожалению, мы не смогли проверить Ваш платёж.",
                              "Хорошо!",
                              false
                            );
                            this.clickOnLink();
                          });
                      }, 500);
                  }, 250);
                }}
              >
                Хорошо
              </Button>
            </div>
          }
        />

        <ModalCard
          id="buyDrumKit"
          onClose={() => {
            this.setActiveModal(null);
          }}
          icon={<Avatar mode="app" src={this.state.good_image} size={64} />}
          header={this.state.good_name}
          className="tw"
          subheader={
            <div>
              {this.state.drumkit_description}
              <AudioPlayer
                autoPlay
                src={this.state.good_track}
                volume="0.3"
                showJumpControls="false"
              />
            </div>
          }
          actions={
            <Button
              style={{ marginTop: "-20px" }}
              size="l"
              mode="primary"
              disabled={
                this.state.admin === true || this.state.drumkit_price === 0
                  ? true
                  : false
              }
              onClick={() => {
                this.clickOnLink();
                this.setActiveModal("confirmPaymentDrumKit");
              }}
            >
              {this.state.admin === true
                ? "Отключено для админов"
                : "Приобрести за " + this.state.drumkit_price + " ₽"}
            </Button>
          }
        />
        <ModalCard
          id="confirmPaymentDrumKit"
          onClose={() => {
            this.setActiveModal();
          }}
          icon={<Icon56ErrorOutline />}
          header="Обратите внимание!"
          subheader={
            "Пожалуйста, не меняйте комментарий к переводу. В нём содержится код, который нам необходим."
          }
          actions={
            <div style={{ display: "flex", width: "100%" }}>
              <Button
                size="l"
                stretched
                mode="destructive"
                onClick={() => {
                  this.clickOnLink();
                  this.setActiveModal("buyDrumKit");
                }}
              >
                Назад
              </Button>
              <Button
                size="l"
                mode="commerce"
                stretched
                onClick={() => {
                  let desc =
                    "Покупка: " +
                    this.state.good_name +
                    " (код: " +
                    queryString.parse(window.location.search).sign.substr(-5) +
                    ")";
                  setTimeout(() => {
                    bridge
                      .send("VKWebAppOpenPayForm", {
                        app_id: 7832713,
                        action: "pay-to-group",
                        params: {
                          group_id: Number(this.state.group_id),
                          amount: Number(this.state.drumkit_price),
                          description: desc,
                        },
                      })
                      .then((data) => {
                        this.setState({ spinner: true });
                        this.setActiveModal();
                        fetch2(
                          "verifyPayment",
                          "transaction_id=" +
                            data.transaction_id +
                            "&drumkit_id=" +
                            this.state.id
                        )
                          .then((data) => {
                            if (data.result === "ok") {
                              this.setState({ spinner: false });
                              this.setTextpage(
                                "Оплата прошла успешно!",
                                "Вы успешно приобрели драм кит. Чтобы получить оплаченный товар, перейдите во вкладку 'Мои покупки'.",
                                "Принято!",
                                true
                              );
                              this.clickOnLink();
                            } else {
                              this.setState({ spinner: false });
                              this.setTextpage(
                                "Оуч! Что произошло?",
                                "К сожалению, мы не смогли проверить Ваш платёж.",
                                "Хорошо!",
                                false
                              );
                              this.clickOnLink();
                            }
                          })
                          .catch(() => {
                            this.setState({ spinner: false });
                            this.setTextpage(
                              "Оуч! Что произошло?",
                              "К сожалению, мы не смогли проверить Ваш платёж.",
                              "Хорошо!",
                              false
                            );
                            this.clickOnLink();
                          });
                      }, 500);
                  }, 250);
                }}
              >
                Хорошо
              </Button>
            </div>
          }
        />

        <ModalPage
          id="addLicense"
          onClose={() => {
            this.setActiveModal(null);
          }}
          header={
            <ModalPageHeader separator={false}>Новая лицензия</ModalPageHeader>
          }
        >
          <Group>
            <FormLayout
              onSubmit={(e) => {
                this.blockButton();
                e.preventDefault();
                if (
                  this.state.license_name !== "" &&
                  this.state.license_price !== "" &&
                  this.state.license_description !== "" &&
                  this.state.disabled !== true
                ) {
                  this.setState({ spinner: true });
                  fetch2(
                    "addLicense",
                    "name=" +
                      encodeURI(this.state.license_name) +
                      "&price=" +
                      encodeURI(this.state.license_price) +
                      "&description=" +
                      encodeURI(this.state.license_description.trim()) +
                      "&popular=" +
                      this.state.popular
                  ).then((data) => {
                    this.setState({ spinner: false });
                    switch (data.result) {
                      case "ok":
                        this.setState({
                          license_name: "",
                          license_description: "",
                          license_price: "",
                        });
                        this.setTextpage(
                          "Лицензия добавлена!",
                          "Вы успешно добавили новую лицензию",
                          "Принято!",
                          true
                        );
                        break;
                      case "dublicate":
                        this.setAlert(
                          "Отчёт об ошибке",
                          "Лицензия с такими данными уже присутствует в базе данных."
                        );
                        break;
                      case "flood":
                        this.setSnackbar(
                          "Ох, флуд-контроль! Попробуйте еще раз через несколько секунд...",
                          3000,
                          false
                        );
                        break;
                      case "error":
                        this.setAlert(
                          "Отчёт об ошибке",
                          "К сожалению, что-то пошло не так...."
                        );
                        break;
                      default:
                        this.setAlert(
                          "Отчёт об ошибке",
                          "К сожалению, что-то пошло не так...."
                        );
                        break;
                    }
                  });
                }
              }}
            >
              <FormLayoutGroup mode="horizontal">
                <FormItem top="Наименование">
                  <Input
                    type="text"
                    name="name"
                    required
                    placeholder="Базовая лицензия"
                    maxLength="50"
                    value={this.state.license_name}
                    onChange={(e) => {
                      this.setState({
                        license_name: e.target.value
                          .replace(/[@+#+*+?+&+%++]/gi, "")
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
                    required
                    name="price"
                    value={this.state.license_price}
                    maxLength="6"
                    onChange={(e) => {
                      this.setState({
                        license_price: e.target.value
                          .replace(/\D+/g, "")
                          .replace(/^0+/, ""),
                      });
                    }}
                  />
                </FormItem>
              </FormLayoutGroup>
              <FormItem top=" (до 300 символов)">
                <Textarea
                  placeholder="Бит в формате MP3, один войс-тег, до 2500 прослушиваний..."
                  name="description"
                  required
                  value={this.state.license_description}
                  maxLength="300"
                  className="fixedTextarea"
                  wrap="soft"
                  onChange={(e) => {
                    this.setState({
                      license_description: e.target.value
                        .replace(/[@+#+*+?+&+%++]/gi, "")
                        .replace(/^\s+/g, ""),
                    });
                  }}
                />
              </FormItem>
              <FormItem top="Выделение лицензии">
                <Div style={{ marginTop: -12, marginBottom: -20 }}>
                  <Checkbox
                    onChange={(e) => {
                      let mode = 0;
                      if (this.state.popular == 0) mode = 1;
                      this.setState({ popular: mode });
                    }}
                  >
                    Отметить лицензию меткой ⭐
                  </Checkbox>
                </Div>
              </FormItem>
              <Div>
                <Button
                  onClick={this.clickOnLink()}
                  stretched
                  mode="secondary"
                  className="fixButton"
                  size="l"
                  disabled={
                    this.state.license_name === "" ||
                    this.state.license_price === "" ||
                    this.state.license_description === "" ||
                    this.state.disabled === true
                      ? true
                      : false
                  }
                >
                  Добавить
                </Button>
              </Div>
            </FormLayout>
          </Group>
        </ModalPage>

        <ModalPage
          id="editLicense"
          onClose={() => {
            this.setActiveModal(null);
            setTimeout(
              () =>
                this.setState({
                  license_name: "",
                  license_description: "",
                  license_price: "",
                  popular: 0,
                }),
              250
            );
          }}
          header={
            <ModalPageHeader separator={false}>Редактирование</ModalPageHeader>
          }
        >
          <Group>
            <FormLayout
              onSubmit={(e) => {
                this.blockButton();
                e.preventDefault();
                if (
                  this.state.license_name !== "" &&
                  this.state.license_price !== "" &&
                  this.state.license_description !== "" &&
                  this.state.disabled !== true
                ) {
                  this.setState({ spinner: true });
                  fetch2(
                    "editLicense",
                    "id=" +
                      this.state.id +
                      "&name=" +
                      encodeURI(this.state.license_name) +
                      "&price=" +
                      encodeURI(this.state.license_price) +
                      "&description=" +
                      encodeURI(this.state.license_description) +
                      "&popular=" +
                      this.state.popular
                  ).then((data) => {
                    this.setState({ spinner: false });
                    switch (data.result) {
                      case "ok":
                        this.setState({
                          license_name: "",
                          license_description: "",
                          license_price: "",
                          id: 0,
                        });
                        this.setTextpage(
                          "Лицензия отредактирована!",
                          "Вы успешно отредактировали лицензию",
                          "Принято!",
                          true
                        );
                        break;
                      case "dublicate":
                        this.setAlert(
                          "Отчёт об ошибке",
                          "Лицензия с такими данными уже присутствует в базе данных."
                        );
                        break;
                      case "flood":
                        this.setSnackbar(
                          "Ох, флуд-контроль! Попробуйте еще раз через несколько секунд...",
                          3000,
                          false
                        );
                        break;
                      case "error":
                        this.setAlert(
                          "Отчёт об ошибке",
                          "К сожалению, что-то пошло не так...."
                        );
                        break;
                      default:
                        this.setAlert(
                          "Отчёт об ошибке",
                          "К сожалению, что-то пошло не так...."
                        );
                        break;
                    }
                  });
                }
              }}
            >
              <FormLayoutGroup mode="horizontal">
                <FormItem top="Наименование">
                  <Input
                    type="text"
                    name="name"
                    required
                    placeholder="Базовая лицензия"
                    maxLength="50"
                    value={this.state.license_name}
                    onChange={(e) => {
                      this.setState({
                        license_name: e.target.value
                          .replace(/[@+#+*+?+&+%++]/gi, "")
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
                    required
                    name="price"
                    value={this.state.license_price}
                    maxLength="6"
                    onChange={(e) => {
                      this.setState({
                        license_price: e.target.value
                          .replace(/\D+/g, "")
                          .replace(/^0+/, ""),
                      });
                    }}
                  />
                </FormItem>
              </FormLayoutGroup>
              <FormItem top="Описание (до 300 символов)">
                <Textarea
                  placeholder="Бит в формате MP3, один войс-тег, до 2500 прослушиваний..."
                  name="description"
                  required
                  className="fixedTextarea"
                  value={this.state.license_description}
                  maxLength="300"
                  style={{
                    overflow: "visible",
                    pointerEvents: "all",
                    zIndex: 100,
                  }}
                  onChange={(e) => {
                    this.setState({
                      license_description: e.target.value
                        .replace(/[@+#+*+?+&+%++]/gi, "")
                        .replace(/^\s+/g, ""),
                    });
                  }}
                />
              </FormItem>
              <FormItem top="Выделение лицензии">
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
                      Отметить лицензию меткой ⭐
                    </Checkbox>
                  ) : (
                    <Checkbox
                      onChange={() => {
                        let mode = 0;
                        if (this.state.popular == 0) mode = 1;
                        this.setState({ popular: mode });
                      }}
                    >
                      Отметить лицензию меткой ⭐
                    </Checkbox>
                  )}
                </Div>
              </FormItem>
              <Div>
                <Button
                  onClick={this.clickOnLink()}
                  stretched
                  mode="secondary"
                  className="fixButton"
                  size="l"
                  disabled={
                    this.state.license_name === "" ||
                    this.state.license_price === "" ||
                    this.state.license_description === "" ||
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
        </ModalPage>

        <ModalPage
          id="addGood"
          onClose={() => {
            this.setActiveModal(null);
          }}
          header={
            <ModalPageHeader separator={false}>Новый бит</ModalPageHeader>
          }
        >
          <Group style={{ textAlign: "left" }}>
            <FormLayout
              onSubmit={(e) => {
                this.blockButton();
                e.preventDefault();
                if (
                  this.state.good_name !== "" &&
                  this.state.selectedFile !== null &&
                  this.state.selectedFile2 !== null &&
                  this.state.disabled !== true &&
                  this.state.blockSend === false
                ) {
                  this.setState({ spinner: true });
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
                          this.setState({
                            selectedFile: null,
                            spinner: false,
                          });
                          this.setAlert(
                            "Отчёт об ошибке",
                            "Мы не смогли добавить бит, так как для загрузки доступны лишь файлы типа png и jpg, а также gif."
                          );
                        } else {
                          this.setState({ good_image: data.data.result });
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
                                {
                                  headers: {
                                    "content-type": "multipart/form-data",
                                  },
                                }
                              )
                              .then((data) => {
                                if (
                                  data.data.result !== "error" &&
                                  data.data.result !== "wrong_type"
                                ) {
                                  fetch2(
                                    "addGood",
                                    "name=" +
                                      encodeURI(this.state.good_name) +
                                      "&track=" +
                                      encodeURI(data.data.result) +
                                      "&image=" +
                                      encodeURI(this.state.good_image)
                                  ).then((data) => {
                                    if (data.result === "ok") {
                                      this.setState({
                                        good_name: "",
                                        selectedFile: null,
                                        selectedFile2: null,
                                        good_image: null,
                                        id: 0,
                                      });
                                      this.setTextpage(
                                        "Бит добавлен!",
                                        "Вы успешно добавили бит. Теперь необходимо добавить ссылки, которые получит покупатель после оплаты.",
                                        "Принято!",
                                        true
                                      );
                                    }
                                    if (data.result === "flood")
                                      this.setSnackbar(
                                        "Ох, флуд-контроль! Попробуйте еще раз через несколько секунд...",
                                        3000,
                                        false
                                      );
                                    this.setState({ spinner: false });
                                  });
                                }
                                if (data.data.result === "wrong_type") {
                                  this.setState({
                                    selectedFile2: null,
                                    spinner: false,
                                  });
                                  this.setAlert(
                                    "Отчёт об ошибке",
                                    "Мы не смогли добавить бит, так как для загрузки доступны лишь аудиофайлы типа mp3, wav, ogg."
                                  );
                                }
                                this.setState({ spinner: false });
                              })
                              .catch(() => {
                                this.setState({ spinner: false });
                                this.setTextpage(
                                  "Воу, что произошло?",
                                  "К сожалению, сервер не вернул какого-либо ответа. Обратитесь в поддержку, пожалуйста.",
                                  "Хорошо!",
                                  false
                                );
                              });
                          }
                        }
                      }
                    });
                }
              }}
            >
              <FormItem top="Наименование">
                <Input
                  type="text"
                  name="name"
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
              <FormItem top="Обложка (до 10 мб)">
                <File
                  style={{ width: "100%" }}
                  before={
                    this.state.selectedFile !== null ? (
                      <Icon24DoneOutline />
                    ) : (
                      <Icon24Camera />
                    )
                  }
                  accept="image/x-png,image/png,image/jpeg,image/gif"
                  controlSize="l"
                  onClick={() => {
                    this.setState({ blockSend: true });
                    setTimeout(() => this.setState({ blockSend: false }), 250);
                  }}
                  onChange={(e) => {
                    e.preventDefault();
                    if (e.target.files[0].size < 10000000) {
                      this.setState({
                        selectedFile: e.target.files[0],
                      });
                    } else {
                      this.setState({
                        selectedFile: null,
                      });
                      this.setAlert(
                        "Отчёт об ошибке",
                        "Обложка не была загружена, так как её размер превышает 10 мб."
                      );
                    }
                  }}
                  mode={
                    this.state.selectedFile !== null ? "commerce" : "secondary"
                  }
                >
                  {this.state.selectedFile !== null ? "Загружено" : "Загрузить"}
                </File>
              </FormItem>
              <FormItem top="Аудиофайл (до 10 мб)">
                <File
                  style={{ width: "100%" }}
                  before={
                    this.state.selectedFile2 !== null ? (
                      <Icon24DoneOutline />
                    ) : (
                      <Icon24VolumeOutline />
                    )
                  }
                  accept=".mp3,audio/*"
                  controlSize="l"
                  onClick={() => {
                    this.setState({ blockSend: true });
                    setTimeout(() => this.setState({ blockSend: false }), 250);
                  }}
                  onChange={(e) => {
                    e.preventDefault();
                    if (e.target.files[0].size < 10000000) {
                      this.setState({
                        selectedFile2: e.target.files[0],
                      });
                    } else {
                      this.setState({
                        selectedFile2: null,
                      });
                      this.setAlert(
                        "Отчёт об ошибке",
                        "Аудиофайл не был загружен, так как его размер превышает 10 мб."
                      );
                    }
                  }}
                  mode={
                    this.state.selectedFile2 !== null ? "commerce" : "secondary"
                  }
                >
                  {this.state.selectedFile2 !== null
                    ? "Загружено"
                    : "Загрузить"}
                </File>
              </FormItem>
              <Div>
                <Button
                  onClick={this.clickOnLink()}
                  stretched
                  mode="secondary"
                  className="fixButton"
                  size="l"
                  disabled={
                    this.state.good_name === "" ||
                    this.state.selectedFile === null ||
                    this.state.selectedFile2 === null ||
                    this.state.disabled === true
                      ? true
                      : false
                  }
                >
                  Добавить
                </Button>
              </Div>
            </FormLayout>
          </Group>
        </ModalPage>

        <ModalPage
          id="addDrumKit"
          onClose={() => {
            this.setActiveModal(null);
          }}
          header={
            <ModalPageHeader separator={false}>Новый драм кит</ModalPageHeader>
          }
        >
          <Group style={{ textAlign: "left" }}>
            <FormLayout
              onSubmit={(e) => {
                this.blockButton();
                e.preventDefault();
                if (
                  this.state.good_name !== "" &&
                  this.state.selectedFile !== null &&
                  this.state.selectedFile2 !== null &&
                  this.state.disabled !== true &&
                  this.state.license_price !== 0 &&
                  this.state.blockSend === false
                ) {
                  this.setState({ spinner: true });
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
                          this.setState({
                            selectedFile: null,
                            spinner: false,
                          });
                          this.setAlert(
                            "Отчёт об ошибке",
                            "Мы не смогли добавить драм кит, так как для загрузки доступны лишь файлы типа png и jpg, а также gif."
                          );
                        } else {
                          this.setState({ good_image: data.data.result });
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
                                {
                                  headers: {
                                    "content-type": "multipart/form-data",
                                  },
                                }
                              )
                              .then((data) => {
                                if (
                                  data.data.result !== "error" &&
                                  data.data.result !== "wrong_type"
                                ) {
                                  fetch2(
                                    "addDrumKit",
                                    "name=" +
                                      encodeURI(this.state.good_name) +
                                      "&track=" +
                                      encodeURI(data.data.result) +
                                      "&price=" +
                                      encodeURI(this.state.license_price) +
                                      "&image=" +
                                      encodeURI(this.state.good_image)
                                  ).then((data) => {
                                    if (data.result === "ok") {
                                      this.setState({
                                        good_name: "",
                                        selectedFile: null,
                                        selectedFile2: null,
                                        good_image: null,
                                        license_price: "",
                                        id: 0,
                                      });
                                      this.setTextpage(
                                        "Драм кит добавлен!",
                                        "Вы успешно добавили драм кит. Теперь необходимо добавить контракт, файлы для скачивания, и описание драм кита.",
                                        "Принято!",
                                        true
                                      );
                                    }
                                    if (data.result === "flood")
                                      this.setSnackbar(
                                        "Ох, флуд-контроль! Попробуйте еще раз через несколько секунд...",
                                        3000,
                                        false
                                      );
                                    this.setState({ spinner: false });
                                  });
                                }
                                if (data.data.result === "wrong_type") {
                                  this.setState({
                                    selectedFile2: null,
                                  });
                                  this.setAlert(
                                    "Отчёт об ошибке",
                                    "Мы не смогли добавить драм кит, так как для загрузки доступны лишь аудиофайлы типа mp3, wav, ogg."
                                  );
                                }
                                this.setState({ spinner: false });
                              })
                              .catch(() => {
                                this.setState({ spinner: false });
                                this.setTextpage(
                                  "Воу, что произошло?",
                                  "К сожалению, сервер не вернул какого-либо ответа. Обратитесь в поддержку, пожалуйста.",
                                  "Хорошо!",
                                  false
                                );
                              });
                          }
                        }
                      }
                    });
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
                <FormItem top="Стоимость">
                  <Input
                    inputMode="numeric"
                    placeholder="990"
                    name="price"
                    value={this.state.license_price}
                    maxLength="6"
                    onChange={(e) => {
                      this.setState({
                        license_price: e.target.value
                          .replace(/\D+/g, "")
                          .replace(/^0+/, ""),
                      });
                    }}
                  />
                </FormItem>
              </FormLayoutGroup>
              <FormItem top="Обложка (до 10 мб)">
                <File
                  style={{ width: "100%" }}
                  before={
                    this.state.selectedFile !== null ? (
                      <Icon24DoneOutline />
                    ) : (
                      <Icon24Camera />
                    )
                  }
                  accept="image/x-png,image/png,image/jpeg,image/gif"
                  controlSize="l"
                  onClick={() => {
                    this.setState({ blockSend: true });
                    setTimeout(() => this.setState({ blockSend: false }), 250);
                  }}
                  onChange={(e) => {
                    e.preventDefault();
                    if (e.target.files[0].size < 10000000) {
                      this.setState({
                        selectedFile: e.target.files[0],
                      });
                    } else {
                      this.setState({
                        selectedFile: null,
                      });
                      this.setAlert(
                        "Отчёт об ошибке",
                        "Обложка не была загружена, так как её размер превышает 10 мб."
                      );
                    }
                  }}
                  mode={
                    this.state.selectedFile !== null ? "commerce" : "secondary"
                  }
                >
                  {this.state.selectedFile !== null ? "Загружено" : "Загрузить"}
                </File>
              </FormItem>
              <FormItem top="Аудиофайл (до 10 мб)">
                <File
                  style={{ width: "100%" }}
                  before={
                    this.state.selectedFile2 !== null ? (
                      <Icon24DoneOutline />
                    ) : (
                      <Icon24VolumeOutline />
                    )
                  }
                  accept=".mp3,audio/*"
                  controlSize="l"
                  onClick={() => {
                    this.setState({ blockSend: true });
                    setTimeout(() => this.setState({ blockSend: false }), 250);
                  }}
                  onChange={(e) => {
                    e.preventDefault();
                    if (e.target.files[0].size < 10000000) {
                      this.setState({
                        selectedFile2: e.target.files[0],
                      });
                    } else {
                      this.setState({
                        selectedFile2: null,
                      });
                      this.setAlert(
                        "Отчёт об ошибке",
                        "Аудиофайл не был загружен, так как его размер превышает 10 мб."
                      );
                    }
                  }}
                  mode={
                    this.state.selectedFile2 !== null ? "commerce" : "secondary"
                  }
                >
                  {this.state.selectedFile2 !== null
                    ? "Загружено"
                    : "Загрузить"}
                </File>
              </FormItem>
              <Div>
                <Button
                  onClick={this.clickOnLink()}
                  stretched
                  mode="secondary"
                  className="fixButton"
                  size="l"
                  disabled={
                    this.state.good_name === "" ||
                    this.state.selectedFile === null ||
                    this.state.selectedFile2 === null ||
                    this.state.license_price === "" ||
                    this.state.disabled === true
                      ? true
                      : false
                  }
                >
                  Добавить
                </Button>
              </Div>
            </FormLayout>
          </Group>
        </ModalPage>

        <ModalCard
          id="add1"
          onClose={() => {
            this.setActiveModal();
          }}
          icon={<Icon56UsersOutline />}
          header={"Этап 1. Подключение сообщества."}
          subheader={
            "Выберите сообщество, в которое Вы хотите установить приложение."
          }
          actions={
            <Button
              size="l"
              disabled={this.state.disabled}
              mode="primary"
              onClick={() => {
                this.blockButton(300);
                if (this.state.group_id !== "") {
                  this.setActiveModal("add2");
                } else {
                  bridge.send("VKWebAppAddToCommunity").then((data) => {
                    this.setState({ group_id: data.group_id });
                    this.setActiveModal("add2");
                  });
                }
              }}
            >
              Подключить сообщество
            </Button>
          }
        />

        <ModalCard
          id="add2"
          onClose={() => {
            this.setActiveModal();
          }}
          icon={<Icon56UsersOutline />}
          header={"Этап 2. Предоставление доступа."}
          subheader={
            "Теперь нам необходимо получить токен от вашего сообщества, чтобы начать работу с ним."
          }
          actions={
            <Button
              size="l"
              mode="primary"
              disabled={this.state.disabled}
              onClick={() => {
                this.blockButton(300);
                bridge
                  .send("VKWebAppGetCommunityToken", {
                    app_id: 7832713,
                    group_id: Number(this.state.group_id),
                    scope: "manage",
                  })
                  .then((data) => {
                    fetch2(
                      "installAppToCommunity",
                      "group_id=" +
                        this.state.group_id +
                        "&access_token=" +
                        data.access_token
                    ).then((data) => {
                      if (data.result === "ok") {
                        this.setTextpage(
                          "Установка прошла успешно!",
                          "Мы успешно установили наше приложение в ваше сообщество. Ну что, переходим на этап настройки и начнём добавлять товары?",
                          "Перейти к настройке",
                          true
                        );
                      }
                      if (data.result === "wrong_permissions") {
                        this.setActiveModal();
                        this.setSnackbar(
                          "Для корректной работы сервиса нам необходим доступ к управлению сообществом",
                          3000,
                          false
                        );
                      }
                      if (data.result === "error") {
                        this.setActiveModal();
                        this.setSnackbar(
                          "Что-то пошло не так, сервер вернул ошибку... обратитесь в поддержку, пожалуйста",
                          3000,
                          false
                        );
                      }
                    });
                  });
              }}
            >
              Предоставить доступ
            </Button>
          }
        />
      </ModalRoot>
    );
    if (platform() !== "ios") window.history.pushState(null, null);
    return (
      <ConfigProvider isWebView={true}>
        {this.state.loaded === true && (
          <View
            activePanel={this.state.activePanel}
            modal={modal}
            onSwipeBack={this.goBack}
            history={this.state.history}
            popout={
              this.state.spinner === true ? (
                <ScreenSpinner size="large" />
              ) : (
                this.state.popout
              )
            }
          >
            <Home
              id={ROUTES.HOME}
              go={this.go}
              setActiveModal={this.setActiveModal}
              clickOnLink={this.clickOnLink}
              setSnackbar={this.setSnackbar}
              setTextpage={this.setTextpage}
              setAlert={this.setAlert}
              user={this.state.user}
              snackbar={this.state.snackbar}
              theme={this.state.theme}
              setCustomAlert={this.setCustomAlert}
              setSpinner={this.setSpinner}
              spinner={this.state.spinner}
            />
            <UserPage
              id={ROUTES.USERPAGE}
              go={this.go}
              setActiveModal={this.setActiveModal}
              clickOnLink={this.clickOnLink}
              snackbar={this.state.snackbar}
              setSpinner={this.setSpinner}
              spinner={this.state.spinner}
            />
            <Goods
              id={ROUTES.GOODS}
              go={this.go}
              setActiveModal={this.setActiveModal}
              clickOnLink={this.clickOnLink}
              setSnackbar={this.setSnackbar}
              setCustomAlert={this.setCustomAlert}
              setTextpage={this.setTextpage}
              user={this.state.user}
              snackbar={this.state.snackbar}
              setAlert={this.setAlert}
              setSpinner={this.setSpinner}
              spinner={this.state.spinner}
              blockButton={this.blockButton}
              disabled={this.state.disabled}
            />
            <Licenses
              id={ROUTES.LICENSES}
              go={this.go}
              setActiveModal={this.setActiveModal}
              clickOnLink={this.clickOnLink}
              setCustomAlert={this.setCustomAlert}
              setSnackbar={this.setSnackbar}
              setTextpage={this.setTextpage}
              user={this.state.user}
              snackbar={this.state.snackbar}
              setSpinner={this.setSpinner}
              spinner={this.state.spinner}
            />
            <Settings
              id={ROUTES.SETTINGS}
              go={this.goBack}
              good_id={this.state.id}
              setCustomAlert={this.setCustomAlert}
              clickOnLink={this.clickOnLink}
              setSnackbar={this.setSnackbar}
              setSpinner={this.setSpinner}
              spinner={this.state.spinner}
              snackbar={this.state.snackbar}
              setAlert={this.setAlert}
            />
            <Cover
              id={ROUTES.COVER}
              go={this.goBack}
              clickOnLink={this.clickOnLink}
              blockButton={this.blockButton}
              setSnackbar={this.setSnackbar}
              snackbar={this.state.snackbar}
              setAlert={this.setAlert}
            />
            <DrumKits
              id={ROUTES.DRUMKITS}
              go={this.go}
              clickOnLink={this.clickOnLink}
              setSnackbar={this.setSnackbar}
              setTextpage={this.setTextpage}
              setCustomAlert={this.setCustomAlert}
              setActiveModal={this.setActiveModal}
              snackbar={this.state.snackbar}
              user={this.state.user}
              blockButton={this.blockButton}
              disabled={this.state.disabled}
              setAlert={this.setAlert}
              setSpinner={this.setSpinner}
              spinner={this.state.spinner}
            />
            <DrumSettings
              id={ROUTES.DRUMSETTINGS}
              go={this.goBack}
              drum_id={this.state.id}
              clickOnLink={this.clickOnLink}
              setSpinner={this.setSpinner}
              spinner={this.state.spinner}
              setSnackbar={this.setSnackbar}
              snackbar={this.state.snackbar}
              setAlert={this.setAlert}
            />
            <Contract
              id={ROUTES.CONTRACT}
              go={this.goBack}
              license_id={this.state.id}
              clickOnLink={this.clickOnLink}
              blockButton={this.blockButton}
              setSnackbar={this.setSnackbar}
              setSpinner={this.setSpinner}
              spinner={this.state.spinner}
              snackbar={this.state.snackbar}
            />
            <Offline id={ROUTES.OFFLINE} />
            <Textpage
              id={ROUTES.TEXTPAGE}
              title={this.state.textpage.title}
              text={this.state.textpage.text}
              button={this.state.textpage.button}
              success={this.state.textpage.success}
              go={this.goBack}
            />
            <FAQ id={ROUTES.FAQ} go={this.go} clickOnLink={this.clickOnLink} />
          </View>
        )}
      </ConfigProvider>
    );
  }
}

export default App;
