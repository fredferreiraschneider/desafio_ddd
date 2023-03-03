import EventHandlerInterface from "../../event-handler.interface";
import CustomerCreatedEvent from "../customer-created.event";


export default class SendNotificationWhenClientUpdateHandler
  implements EventHandlerInterface<CustomerCreatedEvent>
{
  handle(event: CustomerCreatedEvent): void {
    console.log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.nome} alterado para: ${event.eventData.endereco}`); 
  }
}
