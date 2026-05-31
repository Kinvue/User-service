import {
  FriendResponse,
    GetFriendsRequest,
  GetFriendsResponse,
  RespondFriendRequestRequest,
  SendFriendRequestRequest,
} from '@kinvue/contracts/dist/gen/user';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { FriendStatus, UserFriend } from 'generated/prisma/client';
import { FriendsRepository } from './friend.repository';

@Injectable()
export class FriendsService {
  constructor(private readonly friendsRepository: FriendsRepository) {}

  public async sendFriendRequest(
    data: SendFriendRequestRequest,
  ): Promise<FriendResponse> {
    if (data.requesterId === data.receiverId) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'You cannot send friend request to yourself',
      });
    }

    const friend = await this.friendsRepository.createRequest({
      requester: { connect: { id: data.requesterId } },
      receiver: { connect: { id: data.receiverId } },
      status: 'PENDING',
    });

    return this.toFriendResponse(friend);
  }
 public async respondFriendRequest(
  data: RespondFriendRequestRequest,
): Promise<FriendResponse> {
  const newStatus = this.parseResponseStatus(data.status);

  const request = await this.friendsRepository.findById(data.friendshipId);

  if (!request) {
    throw new RpcException({
      code: status.NOT_FOUND,
      message: 'Friend request not found',
    });
  }

  if (request.status !== 'PENDING') {
    throw new RpcException({
      code: status.FAILED_PRECONDITION,
      message: 'Friend request is already processed',
    });
  }

  const friend = await this.friendsRepository.setFriendRequestStatus(
    data.friendshipId,
    newStatus,
  );

  return this.toFriendResponse(friend);
}
public async getFriends(data: GetFriendsRequest): Promise<GetFriendsResponse> {
  const parsedStatus = data.status
    ? this.parseResponseStatus(data.status)
    : undefined;

  const friends = await this.friendsRepository.getUserFriends({
    ...data,
    status: parsedStatus,
  });

  return {
    friends: friends.map((friend) => this.toFriendResponse(friend)),
  };
}



  private parseResponseStatus(value: string): FriendStatus {
    const allowedStatuses: FriendStatus[] = ['ACCEPTED', 'DENIED', 'BLOCKED'];

    if (!allowedStatuses.includes(value as FriendStatus)) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Invalid status field',
      });
    }

    return value as FriendStatus;
  }

  private toFriendResponse(friend: UserFriend): FriendResponse {
  return {
    id: friend.id,
    requesterId: friend.requesterId,
    receiverId: friend.receiverId,
    status: friend.status,
    createdAt: friend.createdAt.toISOString(),
    updatedAt: friend.updatedAt.toISOString(),
  };
}
}