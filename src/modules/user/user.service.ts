import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateProfileRequest, SearchUsersRequest, UpdateProfileRequest, UserProfileResponse } from '@kinvue/contracts/dist/gen/user';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { Prisma } from 'generated/prisma/client';
import { SettingsRepository } from '../settings/settings.repository';

@Injectable()
export class UserService {
  public constructor(
    private readonly userRepository : UserRepository,
    private readonly settingsRepository : SettingsRepository
  ){}

  //Future REST 
  public async getProfile(userId: string) {
    const profile = await this.userRepository.getOne(userId);

    if(!profile){
      throw new RpcException({
        code: status.NOT_FOUND,
        message: "User profile not found"
      })
    }

    return profile;
  }
  public async updateProfile(newProfileData: UpdateProfileRequest) : Promise<UserProfileResponse>{
    const { userId, ...data } = newProfileData;

    try {
      const updatedProfile = await this.userRepository.update(userId, data);
      return updatedProfile;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: 'Profile not found',
        });
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new RpcException({
          code: status.ALREADY_EXISTS,
          message: 'Profile with this data already exists',
        });
      }

      throw new RpcException({
        code: status.INTERNAL,
        message: 'Failed to update profile',
      });
    }
  }
  public async searchUsers(data : SearchUsersRequest) {
    return await this.userRepository.search(data);
  }

  //Future gRCP
  public async createProfile(newProfileInfo: CreateProfileRequest) {
    try {
      const user = await this.userRepository.create(newProfileInfo);
      this.settingsRepository.setupSettings(user.id);
      return user;
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

      throw error
    }
  }
  public getProfileByAuthUserId(authUserId: string) {
    const profile = this.userRepository.getOneByAuthId(authUserId);

    if(!profile){
      throw new RpcException({
        code: status.NOT_FOUND,
        message: "User profile not found"
      })
    }

    return profile;
  }
}