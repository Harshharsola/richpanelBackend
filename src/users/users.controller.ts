import { Body, Controller, Post, Res } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { UsersService } from './users.service';
import { UserSignInDto } from './dtos/userSignIn.dto';
import { UpdateIdAndToken } from './dtos/updateIdandToken.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post('signup')
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res) {
    const response = await this.userService.create(createUserDto);
    res.send(response);
    return;
  }

  @Post('login')
  async signIn(@Body() userSignInDto: UserSignInDto) {
    return this.userService.signIn(userSignInDto);
  }

  @Post('add-id')
  async updateUserId(@Body() updateIdandToken: UpdateIdAndToken, @Res() res) {
    const response = await this.userService.updateUserProfile(updateIdandToken);
    res.send(response);
    return;
  }
}
