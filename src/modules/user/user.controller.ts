import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { GrpcMethod } from '@nestjs/microservices';
import { USER_SERVICE_NAME } from '@kinvue/contracts/dist/gen/constants';
import { SearchUsersRequest, SearchUsersResponse, UserDataResponse } from '@kinvue/contracts/dist/gen/user';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod(USER_SERVICE_NAME, "GetProfile") 
  public GetProfile(dto ) : UserDataResponse{
    return this.userService.getProfile(dto.userId);
  }

  @GrpcMethod(USER_SERVICE_NAME, "UpdateProfile") 
  public UpdateProfile(dto ) : UserDataResponse{
    return this.userService.updateProfile(dto.userId);
  }

  @GrpcMethod(USER_SERVICE_NAME, "SearchUsers") 
  public SearchUsers(dto ) : SearchUsersResponse {
    return this.userService.searchUsers();
  }
}
