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
  Textarea,
  Group,
  Card,
  Text,
} from "@vkontakte/vkui";

class Contract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snackbar: null,
      loaded: false,
      data: "",
    };
    this.sendForm = this.sendForm.bind(this);
  }

  componentDidMount() {
    fetch2("getContractData", "id=" + this.props.license_id).then((data) => {
      if (data.result !== null)
        this.setState({
          data: data.result.replace(/<>/gi, "\n"),
          loaded: true,
        });
      this.props.setSpinner(false);
    });
  }

  sendForm() {
    this.props.setSpinner(true);
    fetch2(
      "editContractData",
      "id=" +
        this.props.license_id +
        "&data=" +
        encodeURI(this.state.data.trim())
    )
      .then((data) => {
        if (data.result === "ok") {
          this.props.setSnackbar("Договор успешно отредактирован!", 3000, true);
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
        if (data.result === "max_length") {
          this.props.setSnackbar(
            "Вы превысили лимит в 4000 символов. Изменения не сохранены.",
            3000,
            false
          );
          this.props.setSpinner(false);
        }
      })
      .catch(() => this.props.setSpinner(false));
  }

  render() {
    let { id, go } = this.props;
    return (
      <Panel id={id}>
        <PanelHeader
          separator={false}
          left={<PanelHeaderBack onClick={() => go()} />}
        >
          Договор
        </PanelHeader>
        {this.props.spinner === false && this.state.loaded === true && (
          <Group>
            <Div>
              <Card>
                <Div>
                  <Text weight="regular" className="tw">
                    {
                      "Обращаем Ваше внимание на то, что Вы можете использовать специальные переменные, которые автоматически заменяются при открытии договора: \n\n$user - Имя и фамилия покупателя\n$track - Название бита\n$date - Дата покупки\n$price - Стоимость лицензии\n\nИспользовать HTML-теги разрешено (например: <b>жирный текст<b/>)."
                    }
                  </Text>
                </Div>
              </Card>
            </Div>
            <FormLayout
              onSubmit={(e) => {
                this.props.blockButton();
                e.preventDefault();
                if (this.state.data !== "" && this.props.disabled !== true) {
                  this.sendForm();
                }
              }}
            >
              <FormItem>
                <Textarea
                  placeholder="Текст договора (до 8000 символов)"
                  name="contract"
                  style={{ height: 200 }}
                  required
                  className="tw"
                  value={this.state.data}
                  maxLength="8000"
                  onChange={(e) => {
                    this.setState({
                      data: e.target.value
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
                  disabled={this.state.data === "" ? true : false}
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

export default Contract;
