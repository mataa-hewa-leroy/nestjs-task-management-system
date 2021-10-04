import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { use } from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { JwtPayload } from "./jwt-payload.interface";
import { User } from "./user.entity";
import { UserRepository } from "./user.repositoty";

@Injectable()
export class JwtStragegy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'topSecret51',
        })
    }
    async validate(payload: JwtPayload): Promise<User> {
        const {username} = payload;
        const user = await this.userRepository.findOne(username)

        if(!user) {
            throw new UnauthorizedException();
            
        }
        return user;
    }
}