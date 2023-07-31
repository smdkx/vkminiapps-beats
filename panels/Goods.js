import React from "react";
import {
  PanelHeader,
  Panel,
  Div,
  Placeholder,
  Button,
  Cell,
  Footer,
  PanelHeaderBack,
  ScreenSpinner,
  Alert,
  RichCell,
  Avatar,
  Group,
} from "@vkontakte/vkui";
import {
  Icon56MarketOutline,
  Icon28DeleteOutline,
  Icon28EditOutline,
  Icon28AddOutline,
  Icon28More,
} from "@vkontakte/icons";

import fetch2 from "../components/Fetch";

/*eslint eqeqeq: "off"*/

class Goods extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: true,
      editMode: false,
      pro: false,
      draggingList: [],
    };
    this.editMode = this.editMode.bind(this);
    this.openAction = this.openAction.bind(this);
    this.deleteLicense = this.deleteLicense.bind(this);
  }

  componentDidMount() {
    fetch2("getGoods").then((data) => {
      let arr = [];
      data.result.goods.forEach((el) => {
        if (el.display === false)
          var style = {
            zIndex: 0,
            filter: "grayscale(100%)",
          };
        else
          style = {
            zIndex: 0,
          };
        arr.push(
          <RichCell
            key={el.id}
            disabled
            before={
              <Avatar size={64} mode="app" src={el.image} style={style} />
            }
            actions={
              <React.Fragment>
                <Button
                  before={<Icon28EditOutline />}
                  onClick={() => this.props.go("settings", el.id)}
                />
                <Button
                  before={<Icon28DeleteOutline />}
                  mode="destructive"
                  onClick={() => this.openAction(el.id)}
                />
              </React.Fragment>
            }
          >
            {el.display === false && (
              <span
                onClick={() => {
                  this.props.setAlert(
                    "Уведомление",
                    "Ваш бит скрыт из общего списка, так как указаны не все возможные лицензии."
                  );
                }}
                className="hide tap"
              >
                СКРЫТО
              </span>
            )}{" "}
            {el.popular == 1 && el.display !== false && (
              <span className="recommended">ХИТ</span>
            )}{" "}
            {el.name}
          </RichCell>
        );
      });
      this.setState({
        draggingList: arr,
        spinner: false,
        pro: data.result.pro,
      });
    });
  }

  deleteLicense(id) {
    fetch2("deleteGood", "id=" + id)
      .then((data) => {
        if (data.result === "ok")
          this.props.setTextpage(
            "Бит удален!",
            "Вы успешно удалили бит.",
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
        text="Вы уверены, что хотите удалить бит?"
      />
    );
  }

  editMode() {
    this.setState({
      editMode: !this.state.editMode,
      disabled: !this.state.disabled,
    });
    if (this.state.editMode === true) {
      let newIDS = [];
      this.state.draggingList.forEach((el) => {
        newIDS.push(el.key);
      });
      fetch2("changePositions", "new=" + newIDS).then((data) => {
        if (data.result === "ok")
          this.props.setSnackbar("Позиции успешно сохранены!", 3000, true);
        if (data.result === "flood")
          this.props.setSnackbar(
            "Ох, флуд-контроль! Попробуйте еще раз через несколько секунд...",
            3000,
            false
          );
      });
    }
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
          Биты
        </PanelHeader>
        {this.state.spinner === false && (
          <Group>
            {this.props.user !== undefined && (
              <Group>
                <Placeholder
                  icon={<Icon56MarketOutline />}
                  header={
                    <span>
                      Это ваши биты,{" "}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: this.props.user.first_name,
                        }}
                      />
                    </span>
                  }
                  action={
                    <div style={{ marginTop: -15 }}>
                      {this.state.editMode === false && (
                        <Button
                          disabled={
                            this.state.pro == false &&
                              this.state.draggingList.length >= 5
                              ? true
                              : false
                          }
                          onClick={() => {
                            this.props.clickOnLink();
                            this.props.setActiveModal("addGood");
                          }}
                          size="l"
                          before={<Icon28AddOutline />}
                        />
                      )}
                      {this.state.draggingList.length !== 0 && (
                        <Button
                          disabled={this.props.disabled}
                          onClick={() => {
                            this.props.blockButton(1000);
                            this.editMode();
                          }}
                          before={
                            this.state.editMode === false ? <Icon28More /> : ""
                          }
                          size="l"
                          mode={
                            this.state.editMode === false
                              ? "secondary"
                              : "commerce"
                          }
                          style={{ marginLeft: 8 }}
                        >
                          {this.state.editMode === false
                            ? "Ред. позиции"
                            : "Сохранить"}
                        </Button>
                      )}
                    </div>
                  }
                >
                  Здесь представлен список битов вашего сообщества. Добавить,
                  удалить, отредактировать — всё здесь. Количество загружаемых
                  битов неограниченно (без подписки до 5).
                </Placeholder>
                <Div style={{ marginTop: -40 }}>
                  {this.state.editMode === true && (
                    <>
                      {this.state.draggingList.map((item) => (
                        <Cell
                          draggable
                          onDragFinish={({ from, to }) => {
                            const draggingList = [...this.state.draggingList];
                            draggingList.splice(from, 1);
                            draggingList.splice(
                              to,
                              0,
                              this.state.draggingList[from]
                            );
                            this.setState({ draggingList });
                          }}
                        >
                          {item}
                        </Cell>
                      ))}
                    </>
                  )}
                  {this.state.editMode === false && this.state.draggingList}
                </Div>
                <Footer>
                  Всего битов: {this.state.draggingList.length} шт.
                </Footer>
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

export default Goods;
