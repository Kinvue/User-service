import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { UserFriendCreateInput } from 'generated/prisma/models';
import { FriendStatus } from 'generated/prisma/enums';
import { GetFriendsRequest } from '@kinvue/contracts/dist/gen/user';

@Injectable()
export class FriendsRepository {
  constructor(private readonly prisma: PrismaService) {}

  public createRequest(data: UserFriendCreateInput) {
    return this.prisma.userFriend.create({ data });
  }

  public findById(id: string) {
    return this.prisma.userFriend.findUnique({
      where: { id },
    });
  }

  public setFriendRequestStatus(id: string, status: FriendStatus) {
    return this.prisma.userFriend.update({
      where: { id },
      data: { status },
    });
  }

  public getUserFriends(data: GetFriendsRequest) {
    const { userId, status, limit, offset } = data;
  
    return this.prisma.userFriend.findMany({
      where: {
        OR: [
          { requesterId: userId },
          { receiverId: userId },
        ],
        ...(status && {
          status: status as FriendStatus,
        }),
      },
      take: limit || 20,
      skip: offset || 0,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}