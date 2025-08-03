import { Controller, Get, HttpCode, Logger } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@Controller('/health-check')
@ApiTags('App')
export class HealthCheckController {
  private readonly logger = new Logger(HealthCheckController.name)

  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Health Check',
    description: 'This endpoint allows you to verify if the server is online.',
  })
  handle(): string {
    this.logger.verbose('Test verbose message')
    this.logger.debug('Test debug message')
    this.logger.log('Test log message')
    this.logger.warn('Test warn message')
    this.logger.error('Test error message')
    return 'OK'
  }
}
