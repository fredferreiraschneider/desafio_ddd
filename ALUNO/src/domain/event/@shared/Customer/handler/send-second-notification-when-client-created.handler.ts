import EventHandlerInterface from "../../event-handler.interface";
import CustomerCreatedEvent from "../customer-created.event";


export default class SendSecondNotificationWhenClientCreatedHandler
  implements EventHandlerInterface<CustomerCreatedEvent>
{
  handle(event: CustomerCreatedEvent): void {
    console.log(`Esse é o segundo console.log do evento: CustomerCreated`); 
  }
}
