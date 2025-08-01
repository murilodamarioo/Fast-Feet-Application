import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env/env';
import { AuthModule } from './auth/auth.module';
import { HttpModule } from './http/htpp.module';
import { EnvModule } from './env/env.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './permission/roles.guard';
import { DatabaseModule } from './database/database.module';
import { JwtAuthGuard } from './auth/jwt-auth-guard';

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
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
  ]
})
export class AppModule {}
