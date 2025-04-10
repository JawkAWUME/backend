import { Injectable } from "@nestjs/common";
import { User } from "./user.schema";
import { UserService } from "./user.service";
import { JwtService }  from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService:JwtService){}

    async validateUser(email:string, password: string) {
        const user = await this.userService.findUserByEmail(email);
        if (!user) return null;

      

        const isPasswordValid = await bcrypt.compare(password,user.password);
        return isPasswordValid ? user: null;
       
    }

    async login(user: User|null){
        if (user){
            const payload = {username: user.username, sub:user._id}
            if (user.isBlocked) {
                return {
                    error:"Ce compte est bloqué. Contactez un administrateur."
                }
            }
            return {
                access_token:this.jwtService.sign(payload)
            }
        }
        return null;
    }
}