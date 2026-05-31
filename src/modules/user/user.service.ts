import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateProfileRequest, SearchUsersRequest, UpdateProfileRequest, UserProfileResponse } from '@kinvue/contracts/dist/gen/user';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { UserMapper } from 'src/common/mappers/user.mapper';

@Injectable()
export class UserService {
  public constructor(
    private readonly userRepository : UserRepository,
    private readonly userMapper : UserMapper
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

    return this.userMapper.toResponse(profile);
  }
  public async updateProfile(newProfileData: UpdateProfileRequest) : Promise<UserProfileResponse>{
    const { userId, ...data } = newProfileData;

    const updatedProfile = await this.userRepository.update(userId, data);
    return this.userMapper.toResponse(updatedProfile);
  }
  public async searchUsers(data: SearchUsersRequest) {
    const users = await this.userRepository.search(data);

    return {
      users: users.map((user) => this.userMapper.toResponse(user)),
    };
  }

  //Future gRCP
  public async createProfile(dto: CreateProfileRequest) {
    const profile = await this.userRepository.create(dto);

    return this.userMapper.toResponse(profile);
  }
  public async getProfileByAuthUserId(authUserId: string) {
    const profile = await this.userRepository.getOneByAuthId(authUserId);

    if(!profile){
      throw new RpcException({
        code: status.NOT_FOUND,
        message: "User profile not found"
      })
    }

    return profile;
  }
}