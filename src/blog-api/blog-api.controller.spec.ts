import { Test, TestingModule } from '@nestjs/testing';
import { BlogApiController } from './blog-api.controller';

describe('BlogApiController', () => {
  let controller: BlogApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogApiController],
    }).compile();

    controller = module.get<BlogApiController>(BlogApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
