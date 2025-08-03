import { Module } from '@nestjs/common'
import { context, trace } from '@opentelemetry/api'
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino'
import { CustomLogger } from './custom-logger.service'

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        level: 'trace',
        serializers: {
          req(req) {
            const span = trace.getSpan(context.active())
            const traceId = span?.spanContext().traceId
            return {
              method: req.method,
              url: req.url,
              traceId: traceId || 'unknown',
            }
          },
        },
      },
    }),
  ],
  providers: [CustomLogger],
  exports: [CustomLogger],
})
export class LoggerModule {}
