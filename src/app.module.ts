import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RatesModule } from './rates/rates.module';
import configuration from './config/configuration';

@Module({
  imports: [ConfigModule.forRoot({load: [configuration]}),RatesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
