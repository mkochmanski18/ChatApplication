import { ApiProperty } from '@nestjs/swagger';

export class pwdChangeDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  oldPassword:string;

  @ApiProperty()
  newPassword: string;
}