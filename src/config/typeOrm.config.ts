import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { join } from 'path';
import { Rate } from '../rates/rate.entity';
import { Symbol } from '../rates/symbol/symbol.entity';
import { readdirSync } from 'fs';

config({ path: join(process.cwd(), '.env') });

const configService = new ConfigService();

console.log(configService.get('NODE_ENV'), configService.get('POSTGRES_HOST'));

export default new DataSource({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: 5432,
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  entities: [Symbol, Rate],
  migrations: readdirSync(join(process.cwd(), 'migrations'))
    .map(filename => join(process.cwd(), 'migrations', filename))
    .filter(Boolean)
});
