import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RatesModule } from './rates/rates.module';
import configuration from './config/configuration';
import { DateScalar } from './common/scalars/date.scalar';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rates } from './rates/rates.entity';
import { CurrencySymbol } from './rates/symbol/symbol.entity';
import { TasksModule } from './rates/tasks/tasks.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('db.host'),
          port: +configService.get('db.port'),
          username: configService.get('db.username'),
          password: configService.get('db.password'),
          database: configService.get('db.database'),
          entities: [CurrencySymbol, Rates],
          synchronize: configService.get('isDev'),
          logging: true
        };
      },
      inject: [ConfigService]
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
        emitTypenameField: true
      }
    }),
    ScheduleModule.forRoot(),
    TasksModule,
    RatesModule
  ],
  controllers: [AppController],
  providers: [DateScalar, AppService]
})
export class AppModule {}
