import { IsNotEmpty } from "class-validator";

export class CreateOrderItemDto {
    @IsNotEmpty()
    quantity: number;

    @IsNotEmpty()
    userId: number;

    @IsNotEmpty()
    productId: number;
}