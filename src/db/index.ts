import { DataSource } from 'typeorm';
import { User } from './entity/User';

let dataSource: DataSource | null = null;

export const getDb = async () => {
    if (!dataSource) {
        dataSource = new DataSource({
            type: 'sqlite',
            database: 'serialized/database.sqlite',
            entities: [User],
            synchronize: true,
        });
        await dataSource.initialize();
    }
    return dataSource;
}