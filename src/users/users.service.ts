import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/users.schema';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserSignInDto } from './dtos/userSignIn.dto';
import { UpdateIdAndToken } from './dtos/updateIdandToken.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const createdUser = new this.userModel(createUserDto);
      await createdUser.save();
      return createdUser._id;
    } catch (error) {
      console.log(error);
      return error;
    }
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

  async updateUserProfile(payload: UpdateIdAndToken) {
    try {
      console.log(payload);
      const user = await this.userModel.findOneAndUpdate(
        { _id: payload.userId },
        { userFbId: payload.userFbId, accessToken: payload.accessToken },
      );
      console.log(user);
      return 'Successfully updated';
    } catch (err) {
      console.log(err);
      return {};
    }
  }
}
