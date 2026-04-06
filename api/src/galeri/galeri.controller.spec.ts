import { Test, TestingModule } from '@nestjs/testing';
import { GaleriController } from './galeri.controller';

describe('GaleriController', () => {
  let controller: GaleriController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GaleriController],
    }).compile();

    controller = module.get<GaleriController>(GaleriController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
