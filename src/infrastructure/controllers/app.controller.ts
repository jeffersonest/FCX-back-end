import { Controller } from '@nestjs/common';
import { AppService } from '../../core/ports/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
