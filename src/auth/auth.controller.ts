import {
  Body,
  Controller,
  Get,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto, SignInUserDto } from './dto';
import { GetUser } from './decorators/';
import { RoleGuard } from './guards/role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
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
  @RoleProtected(AllowedRoles.ADMIN)
  @UseGuards(AuthGuard(), RoleGuard)
  privateRoute(@GetUser('email') email: string) {
    return {
      ok: true,
      message: 'Welcome to the private route',
      data: email,
    };
  }
}
