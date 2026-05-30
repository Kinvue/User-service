import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { USER_SERVICE_NAME } from '@kinvue/contracts/dist/gen/constants';
import { UserService } from './user.service';
import { CreateProfileRequest, GetProfileRequest } from '@kinvue/contracts/dist/gen/user';

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
  public getProfileByAuthUserId(dto) {
    return this.userService.getProfileByAuthUserId(dto.authUserId);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'UpdateProfile')
  public updateProfile(dto) {
    return this.userService.updateProfile(dto);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'SearchUsers')
  public searchUsers(dto) {
    return this.userService.searchUsers(dto);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'GetSettings')
  public getSettings(dto) {
    return this.userService.getSettings(dto.userId);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'UpdateSettings')
  public updateSettings(dto) {
    return this.userService.updateSettings(dto);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'SendFriendRequest')
  public sendFriendRequest(dto) {
    return this.userService.sendFriendRequest(dto);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'RespondFriendRequest')
  public respondFriendRequest(dto) {
    return this.userService.respondFriendRequest(dto);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'GetFriends')
  public getFriends(dto) {
    return this.userService.getFriends(dto);
  }
}