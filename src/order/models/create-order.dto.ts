import { IsInt, IsNotEmpty, Min } from 'class-validator';

class ProductData {
    @IsInt()
    @IsNotEmpty()
    productId: number;

    @IsInt()
    @Min(1)
    quantity: number;
}

export class CreateOrderDto {
    @IsInt()
    @IsNotEmpty()
    userId: number;

    @IsNotEmpty()
    products: ProductData[];
}
