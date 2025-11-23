import { Test, TestingModule } from '@nestjs/testing';
import { ShadowsUnveiledService } from './shadows-unveiled.service';

describe('ShadowsUnveiledService', () => {
  let service: ShadowsUnveiledService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShadowsUnveiledService],
    }).compile();

    service = module.get<ShadowsUnveiledService>(ShadowsUnveiledService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
