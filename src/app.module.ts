import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DataModule } from './data/data.module';
import { ShareModule } from './share/share.module';
import { ShareController } from './share/share.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    MongooseModule.forRoot(process.env.MONGO_DNS),
    DataModule,
    ShareModule
  ],
  controllers: [AppController, ShareController],
  providers: [AppService],
})
export class AppModule {}
