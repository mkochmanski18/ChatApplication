import { Body, Controller, Get, HttpException } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { userData } from "src/utils/interfaces";
import { AdminService } from "./admin.service";

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  //Users
  @Get('/users/all')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 200, description: 'User registered successfuly.'})
  @ApiResponse({ status: 406, description: 'User already exists'})
  @ApiResponse({ status: 409, description: 'User name is taken'})
  @ApiResponse({ status: 500, description: 'Internal server error'})
  getUsers(){
      return this.adminService.getUsers();
  }

  //Named Conversations 
  @Get('/namedConversations/all')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 200, description: 'User registered successfuly.'})
  @ApiResponse({ status: 406, description: 'User already exists'})
  @ApiResponse({ status: 409, description: 'User name is taken'})
  @ApiResponse({ status: 500, description: 'Internal server error'})
  getNamedConversations(){
      return this.adminService.getNamedConversations();
  }

  //Messages
  @Get('/messages/count')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 200, description: 'User registered successfuly.'})
  @ApiResponse({ status: 406, description: 'User already exists'})
  @ApiResponse({ status: 409, description: 'User name is taken'})
  @ApiResponse({ status: 500, description: 'Internal server error'})
  getMessagesByDate(){
      return this.adminService.getMessages();
  }
}