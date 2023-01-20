import { Controller, Delete, Get, HttpException, Inject, Param, Patch, Post,Query,UseGuards } from '@nestjs/common';
import { FriendService } from './friend.service';
import { userData } from 'src/utils/interfaces';
import {
    ApiOperation,
    ApiResponse,
    ApiTags,
  } from '@nestjs/swagger';
import { AuthenticatedGuard, UserIdentityGuard } from 'src/auth/Guards';
import { RelationshipType } from 'src/utils/types';

@ApiTags('friend')
@Controller('friend')
export class FriendController {
    constructor(
        @Inject(FriendService) private friendService: FriendService,
    ){}

    //Friend invitation 
    @UseGuards(AuthenticatedGuard,UserIdentityGuard)
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
    @UseGuards(AuthenticatedGuard,UserIdentityGuard)
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
    @UseGuards(AuthenticatedGuard,UserIdentityGuard)
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
    @UseGuards(AuthenticatedGuard,UserIdentityGuard)
    @Get('invitation')
    @ApiOperation({ summary: 'Get a list of invitations' })
    @ApiResponse({ status: 200, description: 'Invitations found.'})
    @ApiResponse({ status: 404, description: "User Account doesn't exists"})
    getInvitations(
        @Query("userid") userid: string,
    ):Promise<HttpException|userData[]>{
        return this.friendService.getInvitations(userid);
    }

    //Check if user is your friend
    @UseGuards(AuthenticatedGuard,UserIdentityGuard)
    @Get('isFriend')
    @ApiOperation({ summary: 'Check if user is your friend' })
    @ApiResponse({ status: 200, description: 'Operation succedd'})
    @ApiResponse({ status: 404, description: "User Account doesn't exists"})
    isFriend(
        @Query("userid") userid: string,
        @Query("friendid") friendid:string
    ):Promise<HttpException|RelationshipType>{
        return this.friendService.isFriend(userid,friendid);
    }

    //Get a list of confirmed friends
    @UseGuards(AuthenticatedGuard,UserIdentityGuard)
    @Get('list')
    @ApiOperation({ summary: 'Get a list of confirmed friends' })
    @ApiResponse({ status: 200, description: 'Friends found.'})
    @ApiResponse({ status: 404, description: "User Account doesn't exists"})
    getFriendList(
        @Query("userid") userid: string,
    ):Promise<HttpException|userData[]>{
        return this.friendService.getFriendList(userid);
    }

    //Get a list of common friends
    @UseGuards(AuthenticatedGuard,UserIdentityGuard)
    @Get('commonlist')
    @ApiOperation({ summary: 'Get a list of common friends' })
    @ApiResponse({ status: 200, description: 'Friends found.'})
    @ApiResponse({ status: 404, description: "User Account doesn't exists"})
    getCommonFriendList(
        @Query("userid") userid: string,
        @Query("friendid") friendid: string,
    ):Promise<HttpException|userData[]>{
        return this.friendService.getCommonFriendList(userid,friendid);
    }

    //Delete user from friend list
    @UseGuards(AuthenticatedGuard,UserIdentityGuard)
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