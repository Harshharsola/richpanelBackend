import { HttpCode, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/users.schema';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserSignInDto } from './dtos/userSignIn.dto';
import { UpdateIdAndToken } from './dtos/updateIdandToken.dto';
import { getApiResponse } from 'src/utils';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.userModel.findOne({ email: createUserDto.email });
      console.log(user);
      if (user !== null) {
        return getApiResponse({}, '409', 'email already in use');
      }
      const createdUser = new this.userModel(createUserDto);
      await createdUser.save();
      return getApiResponse(
        { _id: createdUser._id },
        '201',
        'successfully created user',
      );
    } catch (error) {
      console.log(error);
      return getApiResponse({}, '500', 'internal server error');
    }
  }

  async signIn(userSignInDto: UserSignInDto) {
    const user = await this.userModel.findOne({
      email: userSignInDto.email,
    });
    console.log(user);
    if (user === null) {
      return getApiResponse({}, '400', 'wrong email');
    }
    if (user.password === userSignInDto.password) {
      return getApiResponse(
        { _id: user._id, userName: user.userName, email: user.email },
        '200',
        'login successfull',
      );
    } else {
      return getApiResponse({}, '400', 'wrong password');
    }
  }

  async updateUserProfile(payload: UpdateIdAndToken) {
    try {
      console.log(payload);
      const user = await this.userModel.findOneAndUpdate(
        { _id: payload.userId },
        { userFbId: payload.userFbId, accessToken: payload.accessToken },
      );
      if (user === null) {
        return getApiResponse({}, '400', 'user does not exist');
      }
      console.log(user);
      return getApiResponse({}, '200', 'access token added succesfully');
    } catch (err) {
      console.log(err);
      return getApiResponse({}, '500', 'internal server error');
    }
  }
}
