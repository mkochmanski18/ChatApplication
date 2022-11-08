import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  firstname: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  sex:string;

  @ApiProperty()
  email: string;
  
  @ApiProperty()
  pwd:string;
}