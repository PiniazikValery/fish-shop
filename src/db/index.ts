import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Product } from "./entity/Product";
import { Order } from "./entity/Order";
import { ChatId } from "./entity/ChatId";

let dataSource: DataSource | null = null;

export const getDb = async () => {
  if (!dataSource) {
    dataSource = new DataSource({
      ssl: true,
      type: "postgres",
      host: process.env.NEXT_POSTGRES_HOST,
      port: +(process.env.NEXT_POSTGRES_PORT || 5432),
      username: process.env.NEXT_POSTGRES_USERNAME,
      password: process.env.NEXT_POSTGRES_PASSWORD,
      database: process.env.NEXT_POSTGRES_DATABASE,
      entities: [User, Product, Order, ChatId],
      synchronize: false,
    });
    await dataSource.initialize();
  }
  return dataSource;
};
