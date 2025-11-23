import { Test, TestingModule } from '@nestjs/testing';
import { ShadowsUnveiledController } from './shadows-unveiled.controller';

describe('ShadowsUnveiledController', () => {
  let controller: ShadowsUnveiledController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShadowsUnveiledController],
    }).compile();

    controller = module.get<ShadowsUnveiledController>(ShadowsUnveiledController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
