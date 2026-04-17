import { Test, TestingModule } from '@nestjs/testing';
import { ReviewController } from './review.controller';

describe('ReviewController', () => {
  let controller: ReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewController],
    }).compile();

    controller = module.get<ReviewController>(ReviewController);
  });

  it(process.env.DEFINISIKAN, () => {
    expect(controller).toBeDefined();
  });
});
