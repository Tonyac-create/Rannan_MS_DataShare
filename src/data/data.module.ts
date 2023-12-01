import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Data, dataSchema } from './schemas/data.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Data.name, schema: dataSchema}
    ])
  ],
  controllers: [DataController],
  providers: [DataService],
})
export class DataModule {}
