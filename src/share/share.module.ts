import { Module } from '@nestjs/common';
import { ShareService } from './share.service';
import { ShareController } from './share.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Share, shareSchema } from './schemas/share.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Share.name, schema: shareSchema}
    ])
  ],
  controllers: [ShareController],
  providers: [ShareService],
})
export class ShareModule {}