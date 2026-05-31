import { Controller } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { GetSettingsRequest, UpdateProfileRequest, USER_SERVICE_NAME } from '@kinvue/contracts/dist/gen/user';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class SettingsController {
  constructor(private readonly settingsService : SettingsService) {}

    @GrpcMethod(USER_SERVICE_NAME, 'GetSettings')
    public async getSettings(data: GetSettingsRequest) {
      return await this.settingsService.getSettings(data.userId);
    }

    @GrpcMethod(USER_SERVICE_NAME, 'UpdateSettings')
    public updateSettings(data : UpdateProfileRequest) {
      return this.settingsService.updateSettings(data);
    }
}
