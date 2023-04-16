import { HttpException, HttpStatus, Body, Controller, Post, Res, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './models/register.dto';
import { JwtService } from "@nestjs/jwt"
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';

@Controller()
export class AuthController {
    constructor(private userService: UserService,
        private jwtService: JwtService) { }

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
        @Body('password') password: string,
        @Res({ passthrough: true }) response: Response
    ) {
        const user = this.userService.findOne({ where: { email: email } });

        if (!user) {
            throw new HttpException('User not found.', HttpStatus.BAD_REQUEST);
        }

        if (!await bcrypt.compare(password, (await user).password)) {
            throw new HttpException('Invalid credentials.', HttpStatus.BAD_REQUEST);
        }

        const jwt = await this.jwtService.signAsync({ id: (await user).id });

        response.cookie('jwt', jwt, { httpOnly: true });

        return user;
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('jwt');

        return {
            message: 'Logout successful'
        }
    }

    @UseGuards(AuthGuard)
    @Get('user')
    async user(
        @Req() request: Request
    ) {
        const cookie = request.cookies['jwt'];

        const data = await this.jwtService.verifyAsync(cookie);

        return this.userService.findOne({ where: { id: data['id'] } });
    }
}
