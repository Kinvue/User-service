import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';


@Module({
  imports: [UserModule, PrismaModule],
})
export class AppModule {}
