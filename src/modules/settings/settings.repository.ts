import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { Prisma, Theme } from 'generated/prisma/client';
import { UpdateSettingsRequest } from '@kinvue/contracts/dist/gen/user';

@Injectable()
export class SettingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  public setupSettings(userId: string) {
    return this.prisma.userSettings.create({
      data: { userId },
    });
  }

  public get(userId: string) {
    return this.prisma.userSettings.findUnique({
      where: { userId },
    });
  }

  public update(userId: string, data: Partial<Omit<UpdateSettingsRequest, 'userId'>>) {
    const updateData: Prisma.UserSettingsUpdateInput = {};

    if (data.theme !== undefined) {
      updateData.theme = data.theme as Theme;
    }

    if (data.language !== undefined) {
      updateData.language = data.language;
    }

    return this.prisma.userSettings.update({
      where: { userId },
      data: updateData,
    });
  }
}