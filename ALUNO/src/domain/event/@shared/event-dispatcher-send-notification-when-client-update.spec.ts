import EventDispatcher from "./event-dispatcher";
import SendNotificationWhenClientUpdateHandler from "./Customer/handler/send-notification-when-client-update.handler";
import CustomerUpdateEvent from "./Customer/customer-update.event";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendNotificationWhenClientUpdateHandler();

    eventDispatcher.register("CustomerUpdateEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerUpdateEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerUpdateEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["CustomerUpdateEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendNotificationWhenClientUpdateHandler();

    eventDispatcher.register("CustomerUpdateEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerUpdateEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("CustomerUpdateEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerUpdateEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerUpdateEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendNotificationWhenClientUpdateHandler();

    eventDispatcher.register("CustomerUpdateEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerUpdateEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["CustomerUpdateEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendNotificationWhenClientUpdateHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("CustomerUpdateEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerUpdateEvent"][0]
    ).toMatchObject(eventHandler);

    const customerUpdateEvent = new CustomerUpdateEvent({
      id: "123",
      nome: "Nome ",
      endereco: "Endereço update",
    });

    eventDispatcher.notify(customerUpdateEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });
});
