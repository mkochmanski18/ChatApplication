import { Body, Controller, Get, HttpException, Post,Query,Res,UploadedFile,UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { AuthenticatedGuard } from 'src/auth/Guards';
import { MessageDto } from './dto/message.dto';
import { MessageService } from './message.service';

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  //Create new text message
  @UseGuards(AuthenticatedGuard)
    @Post('newText')
    @ApiOperation({ summary: 'Send text message to another user' })
    @ApiResponse({ status: 201, description: 'Message sended.'})
    @ApiResponse({ status: 404, description: "Incorrect Username"})
    sendTextMessage(
        @Body() data: MessageDto,
    ):Promise<HttpException>{
        return this.messageService.sendTextMessage(data);
    }

    //Create new message with image
  @UseGuards(AuthenticatedGuard)
  @Post('newImage')
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
      
  @ApiOperation({ summary: 'Send message with image to another user' })
  @UseInterceptors(FileInterceptor('file',{
        storage: diskStorage({
            destination:'./assets/messages',
        })
    }))
  @ApiResponse({ status: 201, description: 'Message sended.'})
  @ApiResponse({ status: 404, description: "Incorrect Username"})
  sendImageMessage(
    @UploadedFile() file: Express.Multer.File,
    @Body() data:any,
  ):Promise<HttpException>{
      return this.messageService.sendImageMessage(data,file);
  }

    //Show all sended messages
    @UseGuards(AuthenticatedGuard)
    @Get()
    @ApiOperation({ summary: 'Show sended messages' })
    @ApiResponse({ status: 200, description: 'Messages downloaded.'})
    @ApiResponse({ status: 400, description: "Incorrect User id"})
    getMessages(
        @Query('userid') userid:string, 
    ):Promise<HttpException|MessageDto[]>{
        console.log(userid)
        return this.messageService.getMessages(userid);
    }

    //Show image_message
    @UseGuards(AuthenticatedGuard)
    @Get()
    @ApiOperation({ summary: 'Show sended messages' })
    @ApiResponse({ status: 200, description: 'Messages downloaded.'})
    @ApiResponse({ status: 400, description: "Incorrect User id"})
    getImageMessage(
        @Query('messageid') userid:string, 
        @Res() res
    ):Promise<HttpException|MessageDto[]>{
        console.log(userid)
        return this.messageService.getImageMessage(userid,res);
    }
}
