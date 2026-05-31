import {
    GetFriendsRequest,
  RespondFriendRequestRequest,
  SendFriendRequestRequest,
} from '@kinvue/contracts/dist/gen/user';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { FriendStatus, Prisma } from 'generated/prisma/client';
import { FriendsRepository } from './friend.repository';

@Injectable()
export class FriendsService {
  constructor(private readonly friendsRepository: FriendsRepository) {}

  public async sendFriendRequest(data: SendFriendRequestRequest) {
    if (data.requesterId === data.receiverId) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'You cannot send friend request to yourself',
      });
    }

    try {
      return await this.friendsRepository.createRequest({
        requester: { connect: { id: data.requesterId } },
        receiver: { connect: { id: data.receiverId } },
        status: 'PENDING',
      });
    } catch (error) {
      this.handleFriendPrismaError(error, 'Failed to send friend request');
    }
  }
  public async respondFriendRequest(data: RespondFriendRequestRequest) {
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

    try {
      return await this.friendsRepository.setFriendRequestStatus(
        data.friendshipId,
        newStatus,
      );
    } catch (error) {
      this.handleFriendPrismaError(error, 'Failed to respond friend request');
    }
  }
  public async getFriends(data: GetFriendsRequest) {
    const { userId, status, limit, offset } = data;
  
    return this.friendsRepository.getUserFriends({
      userId,
      status,
      limit,
      offset,
    });
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
  private handleFriendPrismaError(error: unknown, fallbackMessage: string): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new RpcException({
        code: status.ALREADY_EXISTS,
        message: 'Friend request already sent',
      });
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'User or friend request not found',
      });
    }

    throw new RpcException({
      code: status.INTERNAL,
      message: fallbackMessage,
    });
  }
}