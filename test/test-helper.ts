import { DataType, newDb } from 'pg-mem';
import { DataSource } from 'typeorm';
import { v4 } from 'uuid';

export const setupConnection = async (entities: any[]) => {
  const db = newDb({
    autoCreateForeignKeyIndices: true
  });

  db.public.registerFunction({
    implementation: () => 'test',
    name: 'current_database'
  });
  db.public.registerFunction({
    name: 'version',
    implementation: () => '15.4'
  });

  db.registerExtension('uuid-ossp', schema => {
    schema.registerFunction({
      name: 'uuid_generate_v4',
      returns: DataType.uuid,
      implementation: v4,
      impure: true
    });
  });

  const dataSource: DataSource = await db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities
  });

  await dataSource.initialize();
  await dataSource.synchronize();

  return dataSource;
};
