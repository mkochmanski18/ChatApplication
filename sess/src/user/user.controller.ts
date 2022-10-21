import { Body, Controller, Delete, Get, HttpException, Inject, Param, Patch, Post,Query,Res,UploadedFile,UseGuards, UseInterceptors } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from './user.service';
import { userData } from 'src/utils/interfaces';
import { UserRoleEnum } from "src/utils/types";
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiResponse,
    ApiTags,
  } from '@nestjs/swagger';
import { AuthenticatedGuard } from 'src/auth/Guards';
import { pwdChangeDto } from './dto/pwdChange.dto';
import { RolesGuard } from 'src/auth/Guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(
        @Inject(UserService) private userService: UserService,
    ){}
    
    //User registration
    @Post('/registration')
    @ApiOperation({ summary: 'User registration' })
    @ApiResponse({ status: 201, description: 'User registered successfuly.'})
    @ApiResponse({ status: 406, description: 'User already exists'})
    @ApiResponse({ status: 409, description: 'User name is taken'})
    @ApiResponse({ status: 500, description: 'Internal server error'})
    register(
        @Body() newUser: RegisterDto
    ):Promise<HttpException|userData>{
        return this.userService.register(newUser);
    }
    
    @UseGuards(AuthenticatedGuard)
    @Delete()
    @ApiOperation({ summary: 'User account deletion' })
    @ApiResponse({ status: 200, description: 'User account deleted successfuly.'})
    @ApiResponse({ status: 404, description: "User doesn't exists"})
    @ApiResponse({ status: 500, description: 'Internal server error'})
    deleteAccount(
        @Param('userid') userid:string, 
    ):Promise<HttpException>{
        return this.userService.deleteAccount(userid);
    }

    //Account confirmation
    @Get('/confirmation/:userid')
    @ApiOperation({ summary: 'User account confirmation' })
    @ApiResponse({ status: 200, description: 'User account confirmed'})
    @ApiResponse({ status: 404, description: 'User not found'})
    @ApiResponse({ status: 500, description: 'Internal server error'})
    confirm(
        @Param('userid') userid:string,
    ):Promise<HttpException>{
        return this.userService.confirmAccount(userid);
    }

    //User password change
    @UseGuards(AuthenticatedGuard)
    @Patch('/password')
    @ApiOperation({ summary: 'User password changing' })
    @ApiResponse({ status: 200, description: 'User account password changed'})
    @ApiResponse({ status: 403, description: 'Incorrect Password'})
    @ApiResponse({ status: 404, description: "User doesn't exist!"})
    @ApiResponse({ status: 500, description: 'Internal server error'})
    changePassword(
        @Body() data:pwdChangeDto
    ):Promise<HttpException>{
        return this.userService.changePassword(data);
    }

    //Reset Password Request Endpoint
    @Get('/reset/:email')
    @ApiOperation({ summary: 'Request of reset User password' })
    @ApiResponse({ status: 200, description: 'Request sended'})
    @ApiResponse({ status: 500, description: 'Internal server error'})
    resetPasswordRequest(
        @Param('email') email:string,
    ):Promise<HttpException>{
        return this.userService.resetPasswordRequest(email);
    }

    //User password reset(forgot password func.)
    @Patch('/reset')
    @ApiOperation({ summary: 'User password reset' })
    @ApiResponse({ status: 200, description: 'User account password changed'})
    @ApiResponse({ status: 406, description: 'Password is reapeted!'})
    @ApiResponse({ status: 403, description: 'Link is incorrect!'})
    @ApiResponse({ status: 500, description: 'Internal server error'})
    resetPassword(
        @Query('pwd')password:string,
        @Query('token') token:string,
    ):Promise<HttpException>{
        return this.userService.resetPassword(password, token);
    }

    //Find a user with certain ID
    @UseGuards(AuthenticatedGuard)
    @Get('search/id/:userid')
    @ApiOperation({ summary: 'Find a user with certain userID' })
    @ApiResponse({ status: 200, description: 'User found'})
    @ApiResponse({ status: 404, description: "User doesn't exist!"})
    searchUserById(
        @Param('userid')userid:string,
    ):Promise<HttpException|userData>{
        return this.userService.searchUserById(userid);
    }
    
    //Find a user with certain username
    @UseGuards(AuthenticatedGuard)
    @Get('search/name/:username')
    @ApiOperation({ summary: 'Find a user with certain username' })
    @ApiResponse({ status: 200, description: 'User found'})
    @ApiResponse({ status: 404, description: "User doesn't exist!"})
    searchUserByName(
        @Param('username')name:string,
    ):Promise<HttpException|userData>{
        return this.userService.searchUserByName(name);
    }

    //Find a user with certain email address
    @UseGuards(AuthenticatedGuard)
    @Get('search/email/:email')
    @ApiOperation({ summary: 'Find a user with certain email' })
    @ApiResponse({ status: 200, description: 'User found'})
    @ApiResponse({ status: 404, description: "User doesn't exist!"})
    @ApiResponse({ status: 500, description: 'Internal server error'})
    searchUserByEmail(
        @Param('email')email:string,
    ):Promise<HttpException|userData>{
        return this.userService.searchUserByEmail(email);
    }

    //Changing Username
    @UseGuards(AuthenticatedGuard)
    @Patch('name')
    @ApiOperation({ summary: 'Change username' })
    @ApiResponse({ status: 200, description: 'User data changed'})
    @ApiResponse({ status: 404, description: "User doesn't exist!"})
    @ApiResponse({ status: 406, description: "Username already used!"})
    @ApiResponse({ status: 500, description: 'Internal server error'})
    changeUsername(
        @Query('newname') newname: string,
        @Query('userid') userid: string,
    ):Promise<HttpException>{
        return this.userService.changeUsername(userid,newname);
    }

    //Changing email
    @UseGuards(AuthenticatedGuard)
    @Patch('email')
    @ApiOperation({ summary: 'Change user email' })
    @ApiResponse({ status: 200, description: 'User data changed'})
    @ApiResponse({ status: 404, description: "User doesn't exist!"})
    @ApiResponse({ status: 406, description: "User email already used!"})
    @ApiResponse({ status: 500, description: 'Internal server error'})
    changeUserEmail(
        @Query('newemail') newemail: string,
        @Query('userid') userid: string,
    ):Promise<HttpException>{
        return this.userService.changeUserEmail(userid,newemail);
    }

    //Changing sex
    @UseGuards(AuthenticatedGuard)
    @Patch('sex')
    @ApiOperation({ summary: 'Change user sex' })
    @ApiResponse({ status: 200, description: 'User data changed'})
    @ApiResponse({ status: 404, description: "User doesn't exist!"})
    @ApiResponse({ status: 500, description: 'Internal server error'})
    changeUserSex(
        @Query('newsex') newsex: string,
        @Query('userid') userid: string,
    ):Promise<HttpException>{
        return this.userService.changeUserSex(userid,newsex);
    }

    //Changing role
    @UseGuards(AuthenticatedGuard,RolesGuard)
    @Patch('role')
    @ApiOperation({ summary: 'Change user role' })
    @ApiResponse({ status: 200, description: 'User data changed'})
    @ApiResponse({ status: 404, description: "User doesn't exist!"})
    @ApiResponse({ status: 500, description: 'Internal server error'})
    changeUserRole(
        @Query('newrole') newrole: UserRoleEnum,
        @Query('userid') userid: string,
    ):Promise<HttpException>{
        return this.userService.changeUserRole(userid,newrole);
    }

    @Post('photo')
    @ApiResponse({ status: 201, description: 'Photo has been uploaded'})
    @ApiResponse({ status: 404, description: "User doesn't exist!"})
    @ApiResponse({ status: 500, description: 'Internal server error'})
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            file: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })
    @ApiOperation({ summary: 'Upload user photo' })
    @UseInterceptors(FileInterceptor('file',{
        storage: diskStorage({
            destination:'./assets/user-profiles-images',
        })
    }))
    uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body()body:any,
        ){
            return this.userService.uploadPhoto(file,body.userId);
    }

    @Get('photo/:photoname')
    @ApiResponse({ status: 200, description: 'Photo has been uploaded'})
    @ApiResponse({ status: 404, description: "Photo doesn't exist!"})
    @ApiResponse({ status: 500, description: 'Internal server error'})
    getPhoto(
        @Param('photoname') photo:string,
        @Res() res) {
            return res.sendFile(photo, { root: './assets/user-profile-images' });
    }
}

