import { Injectable } from '@nestjs/common';
import { SettingsRepository } from './settings.repository';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { UpdateProfileRequest, UpdateSettingsRequest } from '@kinvue/contracts/dist/gen/user';
import { Prisma } from 'generated/prisma/client';



@Injectable()
export class SettingsService {
    public constructor(
        private readonly settingsRepository : SettingsRepository
    ) {}

    public async getSettings(userId: string) {
      const settings = await this.settingsRepository.get(userId);
    
      if (!settings) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: 'Settings not found',
        });
      }
    
      return settings;
    }

    public async updateSettings(data: UpdateSettingsRequest) {
        const { userId, ...rest } = data;

        try {
          return await this.settingsRepository.update(userId, rest);
        } catch (error) {
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2025'
          ) {
            throw new RpcException({
              code: status.NOT_FOUND,
              message: 'Settings not found',
            });
          }
      
          throw new RpcException({
            code: status.INTERNAL,
            message: 'Cannot update settings',
          });
        }
    }
}
