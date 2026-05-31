import { CreateProfileRequest, SearchUsersRequest, UpdateProfileRequest, UserProfileResponse } from "@kinvue/contracts/dist/gen/user";
import { Injectable } from "@nestjs/common";
import { Prisma, UserProfile } from "generated/prisma/browser";
import { PrismaService } from "../../infrastructure/prisma/prisma.service";

type UpdateProfileData = Omit<UpdateProfileRequest, 'userId'>;

@Injectable()
export class UserRepository {

    public constructor(
        private readonly prisma : PrismaService
    ){}

    public create (data : CreateProfileRequest) {
        return this.prisma.userProfile.create({ data });
    }

    public getOne(id : string) {
        return this.prisma.userProfile.findUnique({where:{id}});
    }

    public getOneByAuthId(authUserId : string) {
        return this.prisma.userProfile.findUnique({where:{authUserId}});
    }

    public async update(id:string, data : UpdateProfileData) : Promise<UserProfileResponse> {
        return this.toUserProfileResponse( 
            await this.prisma.userProfile.update({
                where: {id},
                data
            })
        );
    }

    public search(data: SearchUsersRequest) {
        const { username, displayName, limit, offset } = data;

        const OR: Prisma.UserProfileWhereInput[] = [];
        if (username) {
          OR.push({
            username: {
              contains: username,
              mode: Prisma.QueryMode.insensitive,
            },
          });
        }
        if (displayName) {
          OR.push({
            displayName: {
              contains: displayName,
              mode: Prisma.QueryMode.insensitive,
            },
          });
        }
        return this.prisma.userProfile.findMany({
          where: OR.length ? { OR } : {},
          take: limit || 20,
          skip: offset || 0,
          orderBy: {
            createdAt: 'desc',
          },
        });
    }


    private toUserProfileResponse(profile: UserProfile): UserProfileResponse {
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