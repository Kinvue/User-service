import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateProfileRequest } from '@kinvue/contracts/dist/gen/user';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class UserService {
  public constructor(
    private readonly userRepository : UserRepository
  ){}

  public async createProfile(newProfileInfo: CreateProfileRequest) {
    try {
      return await this.userRepository.create(newProfileInfo);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new RpcException({
          code: status.ALREADY_EXISTS,
          message: 'Profile already exists',
        });
      }

      throw new RpcException({
        code: status.INTERNAL,
        message: 'Failed to create profile',
      });
    }
  }

  public getProfile(userId: string) {

  }

  public getProfileByAuthUserId(authUserId: string) {

  }

  public updateProfile(dto) {

  }

  public searchUsers(dto) {

  }

  public getSettings(userId: string) {

  }

  public updateSettings(dto) {

  }

  public sendFriendRequest(dto) {

  }

  public respondFriendRequest(dto) {

  }

  public getFriends(dto) {

  }
}