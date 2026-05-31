// user.mapper.ts
import { Injectable } from '@nestjs/common';
import { UserProfile } from 'generated/prisma/client';
import { UserProfileResponse } from '@kinvue/contracts/dist/gen/user';

@Injectable()
export class UserMapper {
  toResponse(profile: UserProfile): UserProfileResponse {
    return {
      id: profile.id,
      authUserId: profile.authUserId,
      username: profile.username,
      displayName: profile.displayName ?? '',
      avatarUrl: profile.avatarUrl ?? '',
      bio: profile.bio ?? '',
      status: profile.status,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }
}