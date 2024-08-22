import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { config as dotenvConfig } from 'dotenv';
import { getENVFile } from '@/configs/env.config';
import { registerAs } from '@nestjs/config';
import { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } from '@environments';

dotenvConfig({ path: getENVFile() });

const config: DataSourceOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  entities: [join(__dirname, '../', 'database/*/*.entity.{js,ts}')],
  migrations: [join(__dirname, '../', 'database/migrations/*.{js,ts}')],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config);
