import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RatesModule } from './rates/rates.module';
import configuration from './config/configuration';
import { DateScalar } from './common/scalars/date.scalar';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.gql']
    }),
    RatesModule
  ],
  controllers: [AppController],
  providers: [DateScalar, AppService]
})
export class AppModule {}

