import { IsOptional, IsNumber } from 'class-validator';

export class UpdateOrderDto {
    @IsNumber()
    @IsOptional()
    total?: number;
}
