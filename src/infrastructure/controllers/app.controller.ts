import { Controller } from '@nestjs/common';
import { AppService } from '../../core/usecases/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
