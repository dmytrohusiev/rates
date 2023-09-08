import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rates } from '../rates.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Rates])],
  providers: [TasksService]
})
export class TasksModule {}
