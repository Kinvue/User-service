import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { UserRepository } from './user.repository';
import { SettingsRepository } from '../settings/settings.repository';
import { UserMapper } from 'src/common/mappers/user.mapper';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService , UserRepository, SettingsRepository, UserMapper],
})
export class UserModule {}
