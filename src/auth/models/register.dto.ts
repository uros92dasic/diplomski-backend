import { IsNotEmpty, IsEmail } from "class-validator";

export class RegisterDto {
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    passwordConfirm: string;

    @IsNotEmpty()
    roleId: number;

}