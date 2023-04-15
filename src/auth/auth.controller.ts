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

    @Post('login')
    async login(
        @Body('email') email: string,
        @Body('password') password: string
    ) {
        const user = this.userService.findOne({ where: { email: email } });

        if (!user) {
            throw new HttpException('User not found.', HttpStatus.BAD_REQUEST);
        }

        if (!await bcrypt.compare(password, (await user).password)) {
            throw new HttpException('Invalid credentials.', HttpStatus.BAD_REQUEST);
        }

        return user;
    }
}
