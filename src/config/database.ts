import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mongodb',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
