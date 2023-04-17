import { IsNotEmpty } from "class-validator";

export class CreateOrderDto {
    @IsNotEmpty()
    userId: number;

    @IsNotEmpty()
    orderItems: number[];
}