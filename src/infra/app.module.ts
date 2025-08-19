import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env/env'
import { AuthModule } from './auth/auth.module'
import { HttpModule } from './http/http.module'
import { EnvModule } from './env/env.module'
import { APP_GUARD } from '@nestjs/core'
import { DatabaseModule } from './database/database.module'
import { JwtAuthGuard } from './auth/jwt-auth-guard'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: env => envSchema.parse(env),
      isGlobal: true
    }),
    AuthModule,
    HttpModule,
    EnvModule,
    DatabaseModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
  ]
})
export class AppModule { }
