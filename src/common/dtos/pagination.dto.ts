import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    example: 10,
    default: 10,
    description: 'The limit of items per page',
    required: false,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit: number;

  @ApiProperty({
    default: 0,
    example: 0,
    description: 'The offset of items per page',
    required: false,
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset: number;
}
