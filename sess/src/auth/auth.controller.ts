import { Body, Controller, Get, Post, Req, Res, Session, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthenticatedGuard, LocalAuthGuard } from './Guards';
import { Request, Response } from 'express';
import { UserService } from 'src/user/user.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 201, description: 'User successfuly logged'})
    @ApiResponse({ status: 406, description: 'Account not confirmed'})
    @ApiResponse({ status: 401, description: 'Invalid login data'})
  async login(
    @Body() req: AuthLoginDto
  ): Promise<any> {
    return this.userService.searchUserByEmail(req.email);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('status')
  async getAuthStatus(@Req() req:Request, @Res() res:Response){
    res.send(req.user);
  }

  @Get('logout')
  @UseGuards(AuthenticatedGuard)
  logout(@Req() req: Request, @Res() res: Response) {
    req.logout((err) => {
      console.log(err);
      return err ? res.send(400) : res.send(200);
    });
  }
}
