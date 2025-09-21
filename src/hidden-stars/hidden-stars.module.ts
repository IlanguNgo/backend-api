import { Module } from '@nestjs/common';
import { HiddenStarsController } from './hidden-stars.controller';
import { HiddenStarsService } from './hidden-stars.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HiddenStar, HiddenStarSchema } from './hidden-stars.schema';

@Module({
   imports: [
      MongooseModule.forFeature([{ name: HiddenStar.name, schema: HiddenStarSchema }]),
    ],
  controllers: [HiddenStarsController],
  providers: [HiddenStarsService]
})
export class HiddenStarsModule {}
