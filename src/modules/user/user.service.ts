import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly profile = {
    id: 'profile_123',
    authUserId: 'auth_user_123',
    username: 'illya',
    displayName: 'Illya Klus',
    avatarUrl: 'https://example.com/avatar.png',
    bio: 'Kinvue user',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  private readonly settings = {
    id: 'settings_123',
    userId: 'profile_123',
    language: 'uk',
    theme: 'dark',
    notificationsEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  private readonly friend = {
    id: 'friendship_123',
    requesterId: 'profile_123',
    receiverId: 'profile_456',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  public createProfile(dto) {
    return {
      ...this.profile,
      authUserId: dto.authUserId,
      username: dto.username ?? this.profile.username,
      displayName: dto.displayName ?? this.profile.displayName,
      avatarUrl: dto.avatarUrl ?? this.profile.avatarUrl,
      bio: dto.bio ?? this.profile.bio,
      updatedAt: new Date().toISOString(),
    };
  }

  public getProfile(userId: string) {
    return {
      ...this.profile,
      id: userId,
    };
  }

  public getProfileByAuthUserId(authUserId: string) {
    return {
      ...this.profile,
      authUserId,
    };
  }

  public updateProfile(dto) {
    return {
      ...this.profile,
      id: dto.userId,
      username: dto.username ?? this.profile.username,
      displayName: dto.displayName ?? this.profile.displayName,
      avatarUrl: dto.avatarUrl ?? this.profile.avatarUrl,
      bio: dto.bio ?? this.profile.bio,
      status: dto.status ?? this.profile.status,
      updatedAt: new Date().toISOString(),
    };
  }

  public searchUsers(dto) {
    return {
      users: [
        this.profile,
        {
          id: 'profile_456',
          authUserId: 'auth_user_456',
          username: dto?.username ?? 'oleh',
          displayName: dto?.displayName ?? 'Oleh Dev',
          avatarUrl: 'https://example.com/avatar-2.png',
          bio: 'Second Kinvue user',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    };
  }

  public getSettings(userId: string) {
    return {
      ...this.settings,
      userId,
    };
  }

  public updateSettings(dto) {
    return {
      ...this.settings,
      userId: dto.userId,
      language: dto.language ?? this.settings.language,
      theme: dto.theme ?? this.settings.theme,
      notificationsEnabled:
        dto.notificationsEnabled ?? this.settings.notificationsEnabled,
      updatedAt: new Date().toISOString(),
    };
  }

  public sendFriendRequest(dto) {
    return {
      ...this.friend,
      requesterId: dto.requesterId,
      receiverId: dto.receiverId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  public respondFriendRequest(dto) {
    return {
      ...this.friend,
      id: dto.friendshipId,
      status: dto.status,
      updatedAt: new Date().toISOString(),
    };
  }

  public getFriends(dto) {
    return {
      friends: [
        {
          ...this.friend,
          requesterId: dto.userId,
          status: dto.status ?? 'accepted',
        },
      ],
    };
  }
}