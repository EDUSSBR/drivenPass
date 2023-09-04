import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('Health')
@Controller('health')
export class HealthController {
  @ApiOperation({
    summary: 'It was made only for testing if api is up and running',
  })
  @Get()
  getHealth() {
    return "I'm Okay";
  }
}
