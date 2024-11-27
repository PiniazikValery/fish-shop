import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Product } from "./entity/Product";
import { Order } from "./entity/Order";
import { ChatId } from "./entity/ChatId";

let dataSource: DataSource | null = null;

export const getDb = async () => {
  if (!dataSource) {
    dataSource = new DataSource({
      type: "mongodb",
      url: process.env.NEXT_PUBLIC_MONGO_CONNECTION_STR,
      useUnifiedTopology: true,
      database: process.env.NEXT_PUBLIC_MONGO_DB_NAME,
      synchronize: true,
      logging: true,
      entities: [User, Product, Order, ChatId],
    });
    await dataSource.initialize();
  }
  return dataSource;
};
