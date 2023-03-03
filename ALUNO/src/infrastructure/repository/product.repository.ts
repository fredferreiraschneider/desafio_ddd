import Product from "../../domain/entity/product";
import EventDispatcher from "../../domain/event/@shared/event-dispatcher";
import SendEmailWhenProductIsCreatedHandler from "../../domain/event/@shared/product/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../domain/event/@shared/product/product-created.event";
import ProductRepositoryInterface from "../../domain/repository/product-repository.interface";
import ProductModel from "../db/sequelize/model/product.model";

export default class ProductRepository implements ProductRepositoryInterface {
 
  async create(entity: Product): Promise<void> {
    await ProductModel.create({
      id: entity.id,
      name: entity.name,
      price: entity.price,
    });


    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    eventDispatcher.register("ProductCreatedEvent", eventHandler);
    const productCreatedEvent = new ProductCreatedEvent({
          name: entity.name,
          price: entity.price,
        });
    eventDispatcher.notify(productCreatedEvent);

  }

  async update(entity: Product): Promise<void> {
    await ProductModel.update(
      {
        name: entity.name,
        price: entity.price,
      },
      {
        where: {
          id: entity.id,
        },
      }
    );
  }

  async find(id: string): Promise<Product> {
    const productModel = await ProductModel.findOne({ where: { id } });
    return new Product(productModel.id, productModel.name, productModel.price);
  }

  async findAll(): Promise<Product[]> {
    const productModels = await ProductModel.findAll();
    return productModels.map((productModel) =>
      new Product(productModel.id, productModel.name, productModel.price)
    );
  }
}
