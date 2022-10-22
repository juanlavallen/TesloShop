import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, SignInUserDto } from './dto';
import { Auth, GetUser } from './decorators/';
import { AllowedRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('sign-in')
  signIn(@Body() signInUserDto: SignInUserDto) {
    return this.authService.signIn(signInUserDto);
  }

  @Get('private')
  @Auth(AllowedRoles.ADMIN)
  privateRoute(@GetUser('email') email: string) {
    return {
      ok: true,
      message: 'Welcome to the private route',
      data: email,
    };
  }
}
