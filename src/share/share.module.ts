import { Module } from '@nestjs/common';
import { ShareService } from './share.service';
import { ShareController } from './share.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Share, shareSchema } from './schemas/share.schema';
import { Data, dataSchema } from 'src/data/schemas/data.schema';
import { DataController } from 'src/data/data.controller';
import { DataService } from 'src/data/data.service';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Share.name, schema: shareSchema},
      { name: Data.name, schema: dataSchema}
    ])
  ],
  controllers: [ShareController, DataController],
  providers: [ShareService, DataService],
})
export class ShareModule {}