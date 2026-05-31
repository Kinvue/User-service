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
    return this.userService.createProfile(dto);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'GetProfile')
  public getProfile(dto: GetProfileRequest) {
    return this.userService.getProfile(dto.userId);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'GetProfileByAuthUserId')
  public getProfileByAuthUserId(dto: GetProfileByAuthUserIdRequest) {
    return this.userService.getProfileByAuthUserId(dto.authUserId);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'UpdateProfile')
  public updateProfile(dto : UpdateProfileRequest) {
    return this.userService.updateProfile(dto);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'SearchUsers')
  public searchUsers(data: SearchUsersRequest) {
    return this.userService.searchUsers(data);
  }

}