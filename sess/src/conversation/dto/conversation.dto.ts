import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';

export class ConversationDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    ownerID: string;

}