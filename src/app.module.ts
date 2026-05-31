import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { SettingsModule } from './modules/settings/settings.module';
import { FriendsModule } from './modules/friends/friends.module';


@Module({
  imports: [UserModule, PrismaModule, SettingsModule, FriendsModule],
})
export class AppModule {}
