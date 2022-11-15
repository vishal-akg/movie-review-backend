import { IsEmail, IsNotEmpty, IsString, Length, Min } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @Length(3)
  password: string;
}

export default CreateUserDto;
