import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateOrderItemDto {
    @IsInt()
    @Min(1)
    @IsOptional()
    quantity?: number;
}
