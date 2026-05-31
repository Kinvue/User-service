import { Controller } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { GetFriendsRequest, RespondFriendRequestRequest, SendFriendRequestRequest, USER_SERVICE_NAME } from '@kinvue/contracts/dist/gen/user';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @GrpcMethod(USER_SERVICE_NAME, 'SendFriendRequest')
  public sendFriendRequest(data : SendFriendRequestRequest) {
    return this.friendsService.sendFriendRequest(data);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'RespondFriendRequest')
  public respondFriendRequest(data: RespondFriendRequestRequest) {
    return this.friendsService.respondFriendRequest(data);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'GetFriends')
  public getFriends(data: GetFriendsRequest) {
    return this.friendsService.getFriends(data);
  }
}
