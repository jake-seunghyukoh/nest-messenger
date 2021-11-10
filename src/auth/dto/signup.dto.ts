import { IsString } from 'class-validator';

export class SignUpDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class SignUpResponseDto {
  id: number;
  username: string;
}
