import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetRawHeaders } from 'src/common/decorators';
import { AuthService } from './auth.service';
import { Auth, RoleProtected } from './decorators';
import { GetUser } from './decorators/get-user.decorator';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @ApiResponse({
    status: 201,
    description: 'The user has been successfully logged in.',
    type: User,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('me')
  @Auth()
  me(@GetUser() user: User) {
    return this.authService.me(user);
  }

  @Get('test')
  @UseGuards(AuthGuard())
  test(
    @GetUser() user: User,
    @GetUser('email') email: string,
    @GetRawHeaders() rawHeaders: string[],
  ) {
    return { user, email, rawHeaders };
  }

  //@SetMetadata('roles', ['admin'])
  @Get('test2')
  @RoleProtected(ValidRoles.ADMIN)
  @UseGuards(AuthGuard(), UserRoleGuard)
  test2(@GetUser() user: User) {
    return { user };
  }

  @Get('test3')
  @Auth(ValidRoles.ADMIN)
  test3(@GetUser() user: User) {
    return { user };
  }
}
