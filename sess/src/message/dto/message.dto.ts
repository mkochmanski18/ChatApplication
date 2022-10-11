import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
    @ApiProperty()
    senderId: string;

    @ApiProperty()
    conversationId: string;

    @ApiProperty()
    datetime: Date;

    @ApiProperty()
    text: string;
}