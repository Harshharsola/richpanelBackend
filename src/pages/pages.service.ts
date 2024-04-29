import { Injectable } from '@nestjs/common';
import { AddPageDto } from './dtos/addPage.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Page, PagesDocument } from 'src/schemas/pages.schema';
import { Model } from 'mongoose';
import { User, UsersDocument } from 'src/schemas/users.schema';
import { FacebookService } from 'src/facebook/facebook.service';
import { getApiResponse } from 'src/utils';

@Injectable()
export class PagesService {
  constructor(
    @InjectModel(Page.name) private pageModel: Model<Page>,
    @InjectModel(User.name) private userModel: Model<Page>,
    private facebookService: FacebookService,
  ) {}
  async add(addPageDto: AddPageDto) {
    const createdPage = new this.pageModel(addPageDto);
    return createdPage.save();
  }

  async get(userId: string) {
    console.log(userId);
    try {
      const user: UsersDocument = await this.userModel.findById(userId);
      if (user === null) {
        return getApiResponse({}, '400', 'no user found');
      }
      const pageArray = await this.facebookService.getPagesForUser(
        user.accessToken,
      );
      if (pageArray.status === '400') {
        return getApiResponse({}, '400', pageArray.message);
      }
      if (pageArray.length === 0) {
        return getApiResponse({}, '200', 'no pages found for the user');
      }

      const pageDocumentArray: PagesDocument[] = pageArray.map((page) => {
        return new this.pageModel({
          userId: user._id,
          fbPageId: page.pageId,
          pageAccessToken: page.pageAccessToken,
          pageName: page.pageName,
        });
      });
      const newPages = pageDocumentArray.map((pageDocument) => {
        return {
          updateOne: {
            filter: { fbPageId: pageDocument.fbPageId },
            update: pageDocument,
            upsert: true,
          },
        };
      });
      const res = await this.pageModel.bulkWrite(newPages);
      return getApiResponse({ pageArray: pageDocumentArray }, '200', 'success');
    } catch (error) {
      console.log(error);
      return getApiResponse({}, '500', 'internal server error');
    }
  }

  async delete(id: string) {
    try {
      const response = await this.pageModel.deleteOne({ _id: id });
      return getApiResponse(response, '200', 'deleted Successfully');
    } catch (error) {
      console.log(error);
      return getApiResponse({}, '500', 'internal server error');
    }
  }
}
