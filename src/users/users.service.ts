import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/users.schema';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserSignInDto } from './dtos/userSignIn.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async signIn(userSignInDto: UserSignInDto) {
    const user = await this.userModel.findOne({
      userName: userSignInDto.userName,
    });
    console.log(user);
    if (user === null) {
      return 'wrong username';
    }
    if (user.password === userSignInDto.password) {
      return 'success';
    } else {
      return 'wrong password';
    }
  }
}
