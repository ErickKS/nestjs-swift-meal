import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { envSchema } from './infra/env/env'
import { EnvModule } from './infra/env/env.module'
import { EventModule } from './infra/events/events.module'
import { HttpModule } from './infra/http/http.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: env => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    HttpModule,
    EventModule,
  ],
})
export class AppModule {}
