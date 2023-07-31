import React from "react";
import {
  PanelHeader,
  Panel,
  Div,
  Placeholder,
  Button,
  Footer,
  PanelHeaderBack,
  ScreenSpinner,
  Alert,
  RichCell,
  Avatar,
  Group,
} from "@vkontakte/vkui";
import {
  Icon56NotePenOutline,
  Icon28EditOutline,
  Icon28DeleteOutline,
  Icon28AddOutline,
  Icon28ArticleOutline,
} from "@vkontakte/icons";

import fetch2 from "../components/Fetch";

/*eslint eqeqeq: "off"*/

class Licenses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: true,
      arr: [],
      pro: false,
    };
    this.openAction = this.openAction.bind(this);
    this.deleteLicense = this.deleteLicense.bind(this);
  }

  componentDidMount() {
    fetch2("getLicenses").then((data) => {
      let arr = [];
      data.result.licenses.forEach((el) => {
        arr.push(
          <RichCell
            key={el.id}
            disabled
            multiline
            before={
              <Avatar size={64} mode="app">
                <span style={{ fontSize: 25 }}>💿</span>
              </Avatar>
            }
            after={el.price + " ₽"}
            actions={
              <React.Fragment>
                <Button
                  before={<Icon28EditOutline />}
                  onClick={() =>
                    this.props.setActiveModal("editLicense", {
                      id: el.id,
                      license_name: el.name,
                      license_description: el.description.replace(/<>/gi, "\n"),
                      license_price: el.price,
                      popular: el.popular,
                    })
                  }
                />
                <Button
                  before={<Icon28ArticleOutline />}
                  onClick={() => this.props.go("contract", el.id)}
                />
                <Button
                  before={<Icon28DeleteOutline />}
                  mode="destructive"
                  onClick={() => this.openAction(el.id)}
                />
              </React.Fragment>
            }
          >
            {el.name} {el.popular == 1 && "⭐"}
          </RichCell>
        );
      });
      this.setState({ arr: arr, spinner: false, pro: data.result.pro });
    });
  }

  deleteLicense(id) {
    fetch2("deleteLicense", "id=" + id)
      .then((data) => {
        if (data.result === "ok")
          this.props.setTextpage(
            "Лицензия удалена!",
            "Вы успешно удалили лицензию.",
            "Окей!",
            true
          );
        if (data.result === "flood")
          this.props.setSnackbar(
            "Ох, флуд-контроль! Попробуйте еще раз через несколько секунд...",
            3000,
            false
          );
      })
      .catch(() => {
        this.props.setSnackbar(
          "Что-то пошло не так... обратитесь в поддержку, пожалуйста",
          3000,
          false
        );
      });
  }

  openAction(id) {
    this.props.setCustomAlert(
      <Alert
        style={{ zIndex: 10 }}
        actions={[
          {
            title: "Да, удалить",
            mode: "destructive",
            autoclose: true,
            action: () => this.deleteLicense(id),
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
        text="Вы уверены, что хотите удалить лицензию?"
      />
    );
  }

  render() {
    let { id, snackbar } = this.props;
    return (
      <Panel id={id} className="homePage">
        <PanelHeader
          separator={false}
          left={
            <PanelHeaderBack
              onClick={() => {
                this.props.go("home");
              }}
            />
          }
        >
          Лицензии
        </PanelHeader>
        {this.state.spinner === false && (
          <Group>
            {this.props.user !== undefined && (
              <Group>
                <Placeholder
                  icon={<Icon56NotePenOutline />}
                  header={"Это ваши лицензии, " + this.props.user.first_name}
                  action={
                    <div style={{ marginTop: -15 }}>
                      <Button
                        disabled={
                          (this.state.pro == false &&
                            this.state.arr.length >= 3) ||
                          this.state.arr.length >= 10
                            ? true
                            : false
                        }
                        onClick={() => {
                          this.props.clickOnLink();
                          this.props.setActiveModal("addLicense");
                        }}
                        size="l"
                        before={<Icon28AddOutline />}
                      >
                        Добавить лицензию
                      </Button>
                    </div>
                  }
                >
                  Здесь представлен список лицензий вашего сообщества. Добавить,
                  удалить, отредактировать — всё здесь. Добавить можно до 10
                  лицензий (без подписки до 3).
                </Placeholder>
                <Div style={{ marginTop: -35 }}>{this.state.arr}</Div>
                <Footer>Всего лицензий: {this.state.arr.length} шт.</Footer>
              </Group>
            )}
          </Group>
        )}
        {snackbar}
        {this.state.spinner === true && <ScreenSpinner size="large" />}
      </Panel>
    );
  }
}

export default Licenses;
