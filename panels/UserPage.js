import React from "react";
import queryString from "query-string";
import "../css/Intro.css";
import {
  PanelHeader,
  Panel,
  Tabbar,
  TabbarItem,
  Epic,
  Div,
  Button,
  Text,
  ScreenSpinner,
  PanelHeaderButton,
  Header,
  Title,
  Card,
  Avatar,
  Group,
  CardScroll,
  RichCell,
} from "@vkontakte/vkui";
import {
  Icon28PlaylistOutline,
  Icon28MarketOutline,
  Icon36MarketOutline,
  Icon28SettingsOutline,
} from "@vkontakte/icons";

import fetch2 from "../components/Fetch";

/*eslint eqeqeq: "off"*/

class UserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      access: 0,
      goods: null,
      spinner: true,
      purchases: null,
      admin: false,
      drumkit: null,
      banner: "",
      activeStory: "catalog",
    };
    this.openPage = this.openPage.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      fetch2("loadUserPage").then((data) => {
        if (data.result.goods !== null && data.result.goods.length !== 0) {
          let arr = [];
          data.result.goods.forEach((el) => {
            arr.push(
              <RichCell
                key={el.id}
                onClick={() =>
                  this.props.setActiveModal(
                    "buy",
                    null,
                    {
                      good_name: el.name,
                      good_image: el.image,
                      good_track: el.track,
                      group_id: data.result.group_id,
                      admin: data.result.admin,
                    },
                    el.id
                  )
                }
                caption="Нажмите, чтобы узнать подробнее"
                after={
                  data.result.price !== null
                    ? "от " + data.result.price + " ₽"
                    : ""
                }
                before={<Avatar size={60} mode="app" src={el.image} />}
              >
                {el.popular == 1 && <span className="recommended">ХИТ</span>}{" "}
                {el.name}
              </RichCell>
            );
          });
          this.setState({ goods: arr });
        } else {
          setTimeout(() => this.setState({ spinner: false }), 250);
        }
        if (
          data.result.drumKits !== null &&
          data.result.drumKits.length !== 0
        ) {
          let drumkits = [];
          data.result.drumKits.forEach((el) => {
            drumkits.push(
              <Card
                key={el.id}
                onClick={() =>
                  this.props.setActiveModal(
                    "buyDrumKit",
                    null,
                    {
                      good_name: el.name,
                      good_image: el.image,
                      good_track: el.track,
                      group_id: data.result.group_id,
                      admin: data.result.admin,
                      drumkit_description: el.description,
                      drumkit_price: el.price,
                    },
                    el.id
                  )
                }
                style={{ width: 64, height: 64 }}
                className="tap nobg"
              >
                <Avatar
                  size="64"
                  style={{ height: 64 }}
                  mode="app"
                  src={el.image}
                />
              </Card>
            );
          });
          this.setState({ drumkits: drumkits });
        }
        if (
          data.result.purchases !== undefined &&
          data.result.purchases.length !== 0
        ) {
          let purchases = [];
          data.result.purchases.forEach((el) => {
            if (el.data[0] !== undefined) {
              purchases.push(
                <Div>
                  <Card>
                    <RichCell
                      before={
                        <Avatar mode="app" size={48} src={el.data[0].image} />
                      }
                      disabled
                    >
                      {el.data[0].name}
                    </RichCell>
                    {el.type !== "drumkit" && (
                      <Div
                        style={{
                          display: "flex",
                          marginTop: "-10px",
                        }}
                      >
                        <a
                          target="_blank"
                          rel="noreferrer"
                          onClick={this.props.clickOnLink()}
                          href={el.data[0][el.type]}
                          style={{ marginBottom: -20, width: "50%" }}
                        >
                          <Button size="l" stretched>
                            Файлы
                          </Button>
                        </a>
                        <a
                          target="_blank"
                          rel="noreferrer"
                          onClick={this.props.clickOnLink()}
                          href={
                            "https://api.trestahouse.com/license?user_id=" +
                            queryString.parse(window.location.search)
                              .vk_user_id +
                            "&group_id=" +
                            queryString.parse(window.location.search)
                              .vk_group_id +
                            "&purchase_id=" +
                            el.data[0].id
                          }
                          style={{ width: "50%", marginLeft: 8 }}
                        >
                          <Button size="l" stretched mode="commerce">
                            Лицензия
                          </Button>
                        </a>
                      </Div>
                    )}
                    {el.type === "drumkit" && (
                      <Div
                        style={{
                          display: "flex",
                          marginTop: "-10px",
                        }}
                      >
                        <a
                          target="_blank"
                          rel="noreferrer"
                          onClick={this.props.clickOnLink()}
                          href={el.data[0].files}
                          style={{ width: "100%" }}
                        >
                          <Button size="l" stretched>
                            Файлы
                          </Button>
                        </a>
                      </Div>
                    )}
                  </Card>
                </Div>
              );
            }
          });
          this.setState({ purchases: purchases });
        }
        this.setState({
          spinner: false,
          admin: data.result.admin,
          banner: data.result.banner,
        });
      });
    }, 500);
  }

  openPage(e) {
    this.setState({ activeStory: e.currentTarget.dataset.story });
  }

  render() {
    let { id, go, snackbar } = this.props;
    return (
      <Panel id={id} className="homePage">
        <Epic
          activeStory={this.state.activeStory}
          tabbar={
            <Tabbar>
              <TabbarItem
                selected={this.state.activeStory === "catalog"}
                data-story="catalog"
                onClick={this.openPage}
                text="Каталог"
              >
                <Icon28PlaylistOutline />
              </TabbarItem>
              <TabbarItem
                selected={this.state.activeStory === "purchases"}
                data-story="purchases"
                onClick={this.openPage}
                text="Покупки"
              >
                <Icon28MarketOutline />
              </TabbarItem>
            </Tabbar>
          }
        >
          {this.state.spinner === false && (
            <Panel id="catalog" activeStory="catalog">
              {this.state.admin === true && (
                <PanelHeader
                  separator={false}
                  left={
                    <PanelHeaderButton onClick={() => go("home")}>
                      <Icon28SettingsOutline />
                    </PanelHeaderButton>
                  }
                >
                  Каталог
                </PanelHeader>
              )}
              {this.state.admin != true && (
                <PanelHeader separator={false}>Каталог</PanelHeader>
              )}
              {(this.state.goods != null || this.state.drumkits != null) && (
                <div>
                  {(this.state.goods != null ||
                    this.state.drumkits != null) && (
                    <Card style={{ background: "none" }}>
                      <img
                        alt="Баннер магазина"
                        style={{ width: "100%" }}
                        className="banner"
                        src={this.state.banner}
                      />
                    </Card>
                  )}
                  {this.state.drumkits != null && (
                    <Group header={<Header mode="secondary">Драм киты</Header>}>
                      <CardScroll size="s">{this.state.drumkits}</CardScroll>
                    </Group>
                  )}
                  {this.state.goods !== null && (
                    <Group
                      header={<Header mode="secondary">Каталог битов</Header>}
                    >
                      <Div
                        style={{
                          marginTop: -10,
                          paddingLeft: 0,
                          paddingRight: 0,
                        }}
                      >
                        {this.state.goods}
                      </Div>
                    </Group>
                  )}
                </div>
              )}
              {this.state.goods == null && this.state.drumkits == null && (
                <Group className="WelcomeBlock" style={{ height: "80vh" }}>
                  <Div>
                    <Avatar size={64} className="avatarCentered">
                      <Icon36MarketOutline />
                    </Avatar>
                    <Title level="1" weight="bold" style={{ marginBottom: 16 }}>
                      Оуч! Тут ничего нет!
                    </Title>
                    <Text weight="regular">
                      Как только администратор добавит товары — они появятся
                      здесь. Ну а пока ждём.
                    </Text>
                  </Div>
                </Group>
              )}
            </Panel>
          )}
          <Panel id="purchases" activeStory="purchases">
            <PanelHeader separator={false}>Мои покупки</PanelHeader>
            {this.state.purchases !== null && (
              <Group>{this.state.purchases}</Group>
            )}
            {this.state.purchases === null && (
              <Group
                className="WelcomeBlock"
                style={{ height: "80vh" }}
                centered="true"
              >
                <Div>
                  <Avatar size={64} className="avatarCentered">
                    <Icon36MarketOutline />
                  </Avatar>
                  <Title level="1" weight="bold" style={{ marginBottom: 16 }}>
                    Оуч! Тут ничего нет!
                  </Title>
                  <Text weight="regular">
                    Как только Вы что-нибудь купите — оно появится здесь. В ту
                    же секунду.
                  </Text>
                  <Button
                    size="l"
                    stretched
                    mode="secondary"
                    onClick={() => {
                      this.setState({
                        activeStory: "catalog",
                      });
                    }}
                  >
                    Перейти в каталог
                  </Button>
                </Div>
              </Group>
            )}
          </Panel>
        </Epic>
        {snackbar}
        {this.state.spinner === true && <ScreenSpinner size="large" />}
      </Panel>
    );
  }
}

export default UserPage;
