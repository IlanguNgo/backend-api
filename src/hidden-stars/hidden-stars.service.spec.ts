import { Test, TestingModule } from '@nestjs/testing';
import { HiddenStarsService } from './hidden-stars.service';

describe('HiddenStarsService', () => {
  let service: HiddenStarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HiddenStarsService],
    }).compile();

    service = module.get<HiddenStarsService>(HiddenStarsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
