import { HttpException, HttpStatus, Body, Controller, Post } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './models/register.dto';


@Controller()
export class AuthController {
    constructor(private userService: UserService) { }

    @Post('register')
    async register(@Body() body: RegisterDto) {
        if (body.password !== body.passwordConfirm) {
            throw new HttpException('Passwords do not match!', HttpStatus.BAD_REQUEST);
        }

        const hashed = await bcrypt.hash(body.password, 12)
        return this.userService.create({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: hashed
        });
    }
}
