import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { USER_SERVICE_NAME } from '@kinvue/contracts/dist/gen/constants';
import { UserService } from './user.service';
import { CreateProfileRequest, GetProfileByAuthUserIdRequest, GetProfileRequest, SearchUsersRequest, UpdateProfileRequest } from '@kinvue/contracts/dist/gen/user';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod(USER_SERVICE_NAME, 'CreateProfile')
  public async createProfile(dto : CreateProfileRequest) {
    return await this.userService.createProfile(dto);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'GetProfile')
  public async getProfile(dto: GetProfileRequest) {
    return  await this.userService.getProfile(dto.userId);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'GetProfileByAuthUserId')
  public async getProfileByAuthUserId(dto: GetProfileByAuthUserIdRequest) {
    return await  this.userService.getProfileByAuthUserId(dto.authUserId);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'UpdateProfile')
  public async updateProfile(dto : UpdateProfileRequest) {
    return await  this.userService.updateProfile(dto);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'SearchUsers')
  public async searchUsers(data: SearchUsersRequest) {
    return  await this.userService.searchUsers(data);
  }

}