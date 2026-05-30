import { CreateProfileRequest } from "@kinvue/contracts/dist/gen/user";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";


@Injectable()
export class UserRepository {

    public constructor(
        private readonly prisma : PrismaService
    ){}

    public create (data : CreateProfileRequest) {
        return this.prisma.userProfile.create({ data });
    }
}