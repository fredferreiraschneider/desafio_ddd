import Order from "../../domain/entity/order";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";
import OrderItem from "../../domain/entity/order_item";

export default class OrderRepository implements OrderRepositoryInterface{

  async create(entity: Order): Promise<void> {
   
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }


  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      {
        customer_id: entity.customerId,
        total: entity.total(),
      },
      {
        where: {
          id: entity.id,
        },
      }
    );
  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({
       where: { id }, include:  OrderItemModel});

      const result: OrderItem[] = [];


      orderModel.items?.map((orderMItem) =>{
        const o = new OrderItem (orderMItem.id, orderMItem.name, 
          orderMItem.price, orderMItem.product_id, orderMItem.quantity)
          result.push(o);
      })

    return new Order(orderModel.id, orderModel.customer_id, result);
  }
  
  
  async findAll(): Promise<Order[]> {
    console.count(" entrou ")
    const orderModel = await OrderModel.findAll({ include: OrderItemModel });
    const ordes: Order[] = [];
    orderModel?.map((order)=>{
      console.count(" MAP  orderModel ")
      
      const orderItens: OrderItem[] = [];
      console.count(" MAP  order.items ")
      order.items?.map((orderMItem) =>{
        const o = new OrderItem (orderMItem.id, orderMItem.name, 
          orderMItem.price, orderMItem.product_id, orderMItem.quantity)
          orderItens.push(o);
      })
      const orde = new Order(order.id, order.customer_id, orderItens);
      ordes.push(orde)
    })
    return ordes
  }
}
