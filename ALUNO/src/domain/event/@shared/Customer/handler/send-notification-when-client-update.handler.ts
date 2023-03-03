import EventHandlerInterface from "../../event-handler.interface";
import CustomerUpadtedEvent from "../customer-update.event";


export default class SendNotificationWhenClientUpdateHandler
  implements EventHandlerInterface<CustomerUpadtedEvent>
{
  handle(event: CustomerUpadtedEvent): void {
    console.log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.nome} alterado para: ${event.eventData.endereco}`); 
  }
}
