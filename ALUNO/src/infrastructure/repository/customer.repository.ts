import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
import CustomerRepositoryInterface from "../../domain/repository/customer-repository.interface";
import CustomerModel from "../db/sequelize/model/customer.model";
import EventDispatcher from "../../domain/event/@shared/event-dispatcher";
import SendFirstNotificationWhenClientCreatedHandler from "../../domain/event/@shared/Customer/handler/send-first-notification-when-client-created.handler";
import CustomerCreatedEvent from "../../domain/event/@shared/Customer/customer-created.event";
import SendSecondNotificationWhenClientCreatedHandler from "../../domain/event/@shared/Customer/handler/send-second-notification-when-client-created.handler";
import SendNotificationWhenClientUpdateHandler from "../../domain/event/@shared/Customer/handler/send-notification-when-client-update.handler";
import CustomerUpdateEvent from "../../domain/event/@shared/Customer/customer-update.event";

export default class CustomerRepository implements CustomerRepositoryInterface {
  async create(entity: Customer): Promise<void> {
    await CustomerModel.create({
      id: entity.id,
      name: entity.name,
      street: entity.Address.street,
      number: entity.Address.number,
      zipcode: entity.Address.zip,
      city: entity.Address.city,
      active: entity.isActive(),
      rewardPoints: entity.rewardPoints,
    });


    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendFirstNotificationWhenClientCreatedHandler();
    eventDispatcher.register("CustomerCreatedEvent", eventHandler);
    const cusCreatedEvent = new CustomerCreatedEvent({
          name: entity.name,
        });
    eventDispatcher.notify(cusCreatedEvent);


    const eventSecondHandler = new SendSecondNotificationWhenClientCreatedHandler();
    eventDispatcher.register("CustomerCreatedEvent", eventSecondHandler);
    const customerCreatedEvent = new CustomerCreatedEvent({
          name: entity.name,
        });
    eventDispatcher.notify(customerCreatedEvent);


  }

  async update(entity: Customer): Promise<void> {
    await CustomerModel.update(
      {
        name: entity.name,
        street: entity.Address.street,
        number: entity.Address.number,
        zipcode: entity.Address.zip,
        city: entity.Address.city,
        active: entity.isActive(),
        rewardPoints: entity.rewardPoints,
      },
      {
        where: {
          id: entity.id,
        },
      }
    );

    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendNotificationWhenClientUpdateHandler();
    eventDispatcher.register("CustomerUpdateEvent", eventHandler);
    const cusCreatedEvent = new CustomerUpdateEvent({
          id: entity.id,
          nome: entity.name,
          endereco: entity.Address.street,
        });
    eventDispatcher.notify(cusCreatedEvent);
  }

  async find(id: string): Promise<Customer> {
    let customerModel;
    try {
      customerModel = await CustomerModel.findOne({
        where: {
          id,
        },
        rejectOnEmpty: true,
      });
    } catch (error) {
      throw new Error("Customer not found");
    }

    const customer = new Customer(id, customerModel.name);
    const address = new Address(
      customerModel.street,
      customerModel.number,
      customerModel.zipcode,
      customerModel.city
    );
    customer.changeAddress(address);
    return customer;
  }

  async findAll(): Promise<Customer[]> {
    const customerModels = await CustomerModel.findAll();

    const customers = customerModels.map((customerModels) => {
      let customer = new Customer(customerModels.id, customerModels.name);
      customer.addRewardPoints(customerModels.rewardPoints);
      const address = new Address(
        customerModels.street,
        customerModels.number,
        customerModels.zipcode,
        customerModels.city
      );
      customer.changeAddress(address);
      if (customerModels.active) {
        customer.activate();
      }
      return customer;
    });

    return customers;
  }
}
