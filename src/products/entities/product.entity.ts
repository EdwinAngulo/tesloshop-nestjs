import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: '1',
    description: 'The unique identifier of the product',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Nike Air Force 1',
    description: 'The title of the product',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  title: string;

  @ApiProperty({
    example: 100,
    description: 'The price of the product',
  })
  @Column('float', { default: 0 })
  price: number;

  @ApiProperty({
    example: 'Nike Air Force 1 description',
    description: 'The description of the product',
    default: '',
  })
  @Column('text', { nullable: true })
  description: string;

  @ApiProperty({
    example: 'nike-air-force-1',
    description: 'The slug of the product',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  slug: string;

  @ApiProperty({
    example: 100,
    description: 'The stock of the product',
    default: 0,
  })
  @Column('int', { default: 0 })
  stock: number;

  @ApiProperty({
    example: ['S', 'M', 'L'],
    description: 'The sizes of the product',
  })
  @Column('text', { array: true })
  sizes: string[];

  @ApiProperty({
    example: 'male',
    description: 'Gender of the product',
  })
  @Column('text')
  gender: string;

  @ApiProperty()
  @Column('text', { array: true, default: [] })
  tags: string[];

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'The image of the product',
  })
  @OneToMany(() => ProductImage, (ProductImage) => ProductImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug.toLowerCase().replace(/ /g, '-').replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug.toLowerCase().replace(/ /g, '-').replaceAll("'", '');
  }
}
