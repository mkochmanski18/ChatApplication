import { Body, Controller, Get, HttpException, Param } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { userData } from "src/utils/interfaces";
import internal from "stream";
import { AdminService } from "./admin.service";

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  //Users
  @Get('/users/all')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 200, description: 'Users found.'})
  @ApiResponse({ status: 500, description: 'Internal server error'})
  getUsers(){
      return this.adminService.getUsers();
  }

  //Named Conversations 
  @Get('/conversation/allnamed')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 200, description: 'Conversations found.'})
  @ApiResponse({ status: 500, description: 'Internal server error'})
  getNamedConversations(){
      return this.adminService.getNamedConversations();
  }

  //Messages
  @Get('/conversation/count/:range')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 200, description: 'Conversations found.'})
  @ApiResponse({ status: 500, description: 'Internal server error'})
  getConversationsCounterByDate(
    @Param('range') range:string,
  ){
      return this.adminService.getConversationsCounter(range);
  }

  //Messages
  @Get('/message/count/:range')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 200, description: 'Messages found.'})
  @ApiResponse({ status: 500, description: 'Internal server error'})
  getMessagesCounterByDate(
    @Param('range') range:string
  ){
      return this.adminService.getMessagesCounter(range);
  }
}