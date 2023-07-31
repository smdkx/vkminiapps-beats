import React from "react";
import {
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Group,
  Placeholder,
  Button,
  RichCell,
  Cell,
  Footer,
  Alert,
  Avatar,
  Div,
  ScreenSpinner,
} from "@vkontakte/vkui";

import {
  Icon56TearOffFlyerOutline,
  Icon28AddOutline,
  Icon28More,
  Icon28EditOutline,
  Icon28DeleteOutline,
} from "@vkontakte/icons";

import fetch2 from "../components/Fetch";

/*eslint eqeqeq: "off"*/

class DrumKits extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: true,
      editMode: false,
      draggingList: [],
    };
    this.editMode = this.editMode.bind(this);
    this.openAction = this.openAction.bind(this);
    this.deleteDrumKit = this.deleteDrumKit.bind(this);
  }

  deleteDrumKit(id) {
    fetch2("deleteDrumKit", "id=" + id)
      .then((data) => {
        if (data.result == "ok")
          this.props.setTextpage(
            "Драм кит удален!",
            "Вы успешно удалили драм кит.",
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
      .catch((err) => {
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
            action: () => this.deleteDrumKit(id),
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
        text="Вы уверены, что хотите удалить драм кит?"
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
      fetch2("changeDrumPositions", "new=" + newIDS).then((data) => {
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

  componentDidMount() {
    fetch2("getDrumKits").then((data) => {
      if (data.result !== null && data.result.length !== 0) {
        var arr = [];
        data.result.forEach((el) => {
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
                    onClick={() => this.props.go("drumsettings", el.id)}
                  />
                  <Button
                    before={<Icon28DeleteOutline />}
                    mode="destructive"
                    onClick={() => this.openAction(el.id)}
                  />
                </React.Fragment>
              }
            >
              {el.display !== false && (
                <span class="hide">{el.price + " ₽"}</span>
              )}{" "}
              {el.display === false && (
                <span
                  onClick={() => {
                    this.props.setAlert(
                      "Уведомление",
                      "Ваш драм кит скрыт из общего списка, так как указаны не все параметры: описание, ссылка на скачивание."
                    );
                  }}
                  className="hide tap"
                >
                  СКРЫТО
                </span>
              )}{" "}
              {el.name}
            </RichCell>
          );
        });
      }
      setTimeout(
        () => this.setState({ spinner: false, draggingList: arr }),
        500
      );
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
          Драм киты
        </PanelHeader>
        {this.state.spinner === false && (
          <Group>
            {this.props.user !== undefined && (
              <Group>
                <Placeholder
                  icon={<Icon56TearOffFlyerOutline />}
                  header={
                    <span>
                      Это ваши драм киты,{" "}
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
                          onClick={() => {
                            this.props.clickOnLink();
                            this.props.setActiveModal("addDrumKit");
                          }}
                          size="l"
                          before={<Icon28AddOutline />}
                        />
                      )}
                      {this.state.draggingList !== undefined &&
                        this.state.draggingList.length !== 0 && (
                          <Button
                            disabled={this.props.disabled}
                            onClick={() => {
                              this.props.blockButton(1000);
                              this.editMode();
                            }}
                            before={
                              this.state.editMode === false ? (
                                <Icon28More />
                              ) : (
                                ""
                              )
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
                  Здесь представлен список драм китов вашего сообщества.
                  Добавить, удалить, отредактировать — всё здесь. Количество
                  загружаемых драм китов неограниченно.
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
                  Всего драм китов:{" "}
                  {this.state.draggingList !== undefined
                    ? this.state.draggingList.length
                    : 0}{" "}
                  шт.
                </Footer>
              </Group>
            )}
          </Group>
        )}
        {this.state.spinner === true && <ScreenSpinner size="large" />}
        {this.props.snackbar}
      </Panel>
    );
  }
}

export default DrumKits;
