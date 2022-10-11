import { Controller, Delete, Get, HttpException, Inject, Param, Patch, Post,Query,UseGuards } from '@nestjs/common';
import { FriendService } from './friend.service';
import { userData } from 'src/utils/interfaces';
import {
    ApiOperation,
    ApiResponse,
    ApiTags,
  } from '@nestjs/swagger';
import { AuthenticatedGuard } from 'src/auth/Guards';

@ApiTags('friend')
@Controller('friend')
export class FriendController {
    constructor(
        @Inject(FriendService) private friendService: FriendService,
    ){}

    //Friend invitation 
    @UseGuards(AuthenticatedGuard)
    @Post('/invitation')
    @ApiOperation({ summary: 'Invitation to a new friend' })
    @ApiResponse({ status: 201, description: 'User invited.'})
    @ApiResponse({ status: 404, description: "User Account/Friend account doesn't exists"})
    inviteUser(
        @Query("userid") userid: string,
        @Query("friendid") friendid: string,
    ):Promise<HttpException>{
        return this.friendService.inviteUser(userid, friendid);
    }

    //Confirmation of the relation between users
    @UseGuards(AuthenticatedGuard)
    @Patch('/invitation/confirm')
    @ApiOperation({ summary: 'Confirm invitation from friend' })
    @ApiResponse({ status: 200, description: 'Invitation confirmed.'})
    @ApiResponse({ status: 404, description: "User Account/Friend Account/Invitation doesn't exists"})
    confirmInvitation(
        @Query("userid") userid: string,
        @Query("friendid") friendid: string,
    ):Promise<HttpException>{
        return this.friendService.confirmInvitation(userid, friendid);
    }

    //Reject of the getting relation with user
    @UseGuards(AuthenticatedGuard)
    @Patch('/invitation/reject')
    @ApiOperation({ summary: 'Reject invitation from friend' })
    @ApiResponse({ status: 200, description: 'Invitation rejected.'})
    @ApiResponse({ status: 404, description: "User Account/Friend Account/Invitation doesn't exists"})
    rejectInvitation(
        @Query("userid") userid: string,
        @Query("friendid") friendid: string,
    ):Promise<HttpException>{
        return this.friendService.rejectInvitation(userid, friendid);
    }

    //Get a list of invitations
    @UseGuards(AuthenticatedGuard)
    @Get('invitation')
    @ApiOperation({ summary: 'Get a list of invitations' })
    @ApiResponse({ status: 200, description: 'Invitations found.'})
    @ApiResponse({ status: 404, description: "User Account doesn't exists"})
    getInvitations(
        @Query("userid") userid: string,
    ):Promise<HttpException|userData[]>{
        return this.friendService.getInvitations(userid);
    }

    //Get a list of confirmed friends
    @UseGuards(AuthenticatedGuard)
    @Get('list')
    @ApiOperation({ summary: 'Get a list of confirmed friends' })
    @ApiResponse({ status: 200, description: 'Friends found.'})
    @ApiResponse({ status: 404, description: "User Account doesn't exists"})
    getFriendList(
        @Query("userid") userid: string,
    ):Promise<HttpException|userData[]>{
        return this.friendService.getFriendList(userid);
    }

    //Delete user from friend list
    @UseGuards(AuthenticatedGuard)
    @Delete()
    @ApiOperation({ summary: 'Delete user from friend list' })
    @ApiResponse({ status: 200, description: 'User deleted from list.'})
    @ApiResponse({ status: 404, description: "User Account doesn't exists"})
    deleteFriend(
        @Query("userid") userid: string,
        @Query("friendid") friendid: string,
    ):Promise<HttpException>{
        return this.friendService.deleteFriend(userid,friendid);
    }
}