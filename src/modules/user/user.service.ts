import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    public getProfile (userId : string) {
        return {
            id: "yubfuyewd",
            name: "illya",
            email: "klusilla2@gmail.com",
            isEmailVerified: true,
            isBanned: false,
            createdAt: "now",
            updatedAt: "now",
        }
    }

    public updateProfile (userId : string) {
        return {
            id: "yubfuyewd",
            name: "illya",
            email: "klusilla2@gmail.com",
            isEmailVerified: true,
            isBanned: false,
            createdAt: "now",
            updatedAt: "now",
        }
    }

    public searchUsers () {
        return {
            users: [{
                id: "yubfuyewd",
                name: "illya",
                email: "klusilla2@gmail.com",
                isEmailVerified: true,
                isBanned: false,
                createdAt: "now",
                updatedAt: "now",
            }]
        }

    }
}
