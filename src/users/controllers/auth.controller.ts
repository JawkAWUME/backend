import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { UserService } from "../user.service";

@Controller('auth')
export class AuthController {
    constructor( private authService: AuthService,private userService:UserService) {}

    @Post('register')
    async register(@Body() body: {username: string, email: string; password: string}) {
        return this.userService.createUser(body.username,body.email,body.password);
    }

    @Post('login')
    async login(@Body() body: {email: string; password: string}) {
        return this.authService.login(await this.authService.validateUser(body.email,body.password));
    }

    
}