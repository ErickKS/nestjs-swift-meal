import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { OpenTelemetryModule } from 'nestjs-otel'
import { envSchema } from './infra/env/env'
import { EnvModule } from './infra/env/env.module'
import { EventsModule } from './infra/events/events.module'
import { HttpModule } from './infra/http/http.module'
import { LoggerModule } from './infra/logger/logger.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: env => envSchema.parse(env),
      isGlobal: true,
    }),
    OpenTelemetryModule.forRoot({
      metrics: {
        hostMetrics: true,
      },
    }),
    EnvModule,
    LoggerModule,
    HttpModule,
    EventsModule,
  ],
})
export class AppModule {}
