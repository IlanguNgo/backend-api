import { Test, TestingModule } from '@nestjs/testing';
import { HiddenStarsController } from './hidden-stars.controller';

describe('HiddenStarsController', () => {
  let controller: HiddenStarsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HiddenStarsController],
    }).compile();

    controller = module.get<HiddenStarsController>(HiddenStarsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
