import React from "react";
import {
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Group,
  ContentCard,
  CardGrid,
  Footer,
  Div,
  Button,
} from "@vkontakte/vkui";

class FAQ extends React.Component {
  render() {
    let { id, go } = this.props;
    return (
      <Panel id={id}>
        <PanelHeader
          separator={false}
          left={<PanelHeaderBack onClick={() => go("home")} />}
        >
          О сервисе
        </PanelHeader>
        <Group>
          <CardGrid size="l">
            <ContentCard
              subtitle="ОПИСАНИЕ СЕРВИСА"
              disabled
              className="tw"
              header="Что это за сервис такой?"
              text={
                "Beat Store – платформа для музыкальных продюсеров и их клиентов, позволяющая совершать моментальные онлайн-покупки без переписок.\n\nПополняйте каталог Ваших битов, создавайте собственные виды лицензий, делитесь своими звуковыми наборами, добавляйте акции к товарам."
              }
              maxheight={200}
            />
            <ContentCard
              subtitle="НЕМНОГО О ПРОДАЖАХ"
              disabled
              className="tw"
              header="Информация о продажах"
              text={
                "Чтобы получать и выводить средства, необходимо пройти идентификацию в сервисе VK Pay (возможности - улучшить - проверить данные) и добавить банковскую карту (настройки - привязанные карты - добавить карту).\n\nВ настройках приложения Вашего банка не забудьте включить функцию «Система Быстрых Платежей» для вывода средств без комиссии (Сбербанк - поиск - СБП)\n\nПосле этого необходимо зайти в сервис VK Pay - Баланс - Вывести - Сумма - способ вывода СБП (Система Быстрых Платежей) - Выберите из списка ваш банк. Готово!\n\nПосле каждой следующей покупки Вы получаете уведомление об успешной сделке: информацию о покупателе и приобретенном товаре. Комиссия с продаж не взимается, весь доход остаётся у Вас."
              }
              maxheight={200}
            />
            <ContentCard
              subtitle="УДОБНАЯ ФИЧА"
              disabled
              header="Информация о договорах"
              text="Договор генерируется индивидуально для каждого покупателя исходя из условий Ваших лицензий и хранится в истории покупок клиента. Прежде чем начать продажу битов: зайдите в раздел «Лицензии», напротив каждой лицензии вы заметите иконку договора. Впишите своё имя и никнейм, если ваши условия договора отличаются от стандартного шаблона, то отредактируйте его на своё усмотрение."
              maxheight={200}
            />
            <ContentCard
              subtitle="ФИЧИ СЕРВИСА"
              disabled
              header="Основные возможности сервиса"
              className="tw"
              text={
                "- моментальная доставка товара \n- встроенный аудиоплеер \n- выбор типа лицензии \n- генерация договора \n- история покупок \n- оплата по карте"
              }
              maxheight={200}
            />
            <ContentCard
              subtitle="ИНФОРМАЦИЯ О ПРИЛОЖЕНИИ"
              disabled
              className="tw"
              header="Команда"
              text={"Создатель: tresta\nРазработчик: Никита Балин"}
              maxheight={200}
            />
          </CardGrid>
          <Div>
            <Button
              href="https://vk.com/trestahouse"
              target="_blank"
              onClick={this.props.clickOnLink()}
              stretched
              mode="secondary"
              className="fixButton"
              size="l"
            >
              Паблик создателя
            </Button>
            <Button
              href="https://vk.com/write172118960"
              target="_blank"
              style={{ marginTop: 10 }}
              onClick={this.props.clickOnLink()}
              stretched
              mode="secondary"
              className="fixButton"
              size="l"
            >
              Написать разработчику
            </Button>
          </Div>
        </Group>
        <Footer>v1.1.0</Footer>
      </Panel>
    );
  }
}

export default FAQ;
