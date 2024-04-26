import { Injectable } from '@nestjs/common';
import { AddPageDto } from './dtos/addPage.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Page, PagesDocument } from 'src/schemas/pages.schema';
import { Model } from 'mongoose';
import { User, UsersDocument } from 'src/schemas/users.schema';
import { FacebookService } from 'src/facebook/facebook.service';

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
    const user: UsersDocument = await this.userModel.findById(userId);
    const pageArray = await this.facebookService.getPagesForUser(
      user.accessToken,
    );
    const pageDocumentArray: PagesDocument[] = pageArray.map((page) => {
      return new this.pageModel({
        userId: user._id,
        fbPageId: page.pageId,
        pageAccessToken: page.pageAccessToken,
        pageName: page.pageName,
      });
    });
    await this.pageModel.insertMany(pageDocumentArray);
    return { pageArray };
  }
}

// {
//     "name": "Harsh Harsola",
//     "metadata": {
//         "fields": [
//             {
//                 "name": "about",
//                 "description": "*Returns no data as of April 4, 2018.*",
//                 "type": "string"
//             },
//             {
//                 "name": "id",
//                 "description": "The app user's App-Scoped User ID. This ID is unique to the app and cannot be used by other apps.",
//                 "type": "numeric string"
//             },
//             {
//                 "name": "age_range",
//                 "description": "The age segment for this person expressed as a minimum and maximum age. For example, more than 18, less than 21.",
//                 "type": "agerange"
//             },
//             {
//                 "name": "avatar_2d_profile_picture",
//                 "description": "The user's 2D avatar profile picture",
//                 "type": "avatarprofilepicture"
//             },
//             {
//                 "name": "birthday",
//                 "description": "The person's birthday.  This is a fixed format string, like `MM/DD/YYYY`.  However, people can control who can see the year they were born separately from the month and day so this string can be only the year (YYYY) or the month + day (MM/DD)",
//                 "type": "string"
//             },
//             {
//                 "name": "education",
//                 "description": "*Returns no data as of April 4, 2018.*",
//                 "type": "list<educationexperience>"
//             },
//             {
//                 "name": "email",
//                 "description": "The User's primary email address listed on their profile. This field will not be returned if no valid email address is available.",
//                 "type": "string"
//             },
//             {
//                 "name": "favorite_athletes",
//                 "description": "Athletes the User likes.",
//                 "type": "list<experience>"
//             },
//             {
//                 "name": "favorite_teams",
//                 "description": "Sports teams the User likes.",
//                 "type": "list<experience>"
//             },
//             {
//                 "name": "first_name",
//                 "description": "The person's first name",
//                 "type": "string"
//             },
//             {
//                 "name": "gender",
//                 "description": "The gender selected by this person, `male` or `female`. If the gender is set to a custom value, this value will be based off of the selected pronoun; it will be omitted if the pronoun is neutral.",
//                 "type": "string"
//             },
//             {
//                 "name": "hometown",
//                 "description": "The person's hometown",
//                 "type": "page"
//             },
//             {
//                 "name": "id_for_avatars",
//                 "description": "A profile based app scoped ID. It is used to query avatars",
//                 "type": "numeric string"
//             },
//             {
//                 "name": "inspirational_people",
//                 "description": "The person's inspirational people",
//                 "type": "list<experience>"
//             },
//             {
//                 "name": "install_type",
//                 "description": "Install type",
//                 "type": "enum"
//             },
//             {
//                 "name": "installed",
//                 "description": "Is the app making the request installed",
//                 "type": "bool"
//             },
//             {
//                 "name": "is_guest_user",
//                 "description": "if the current user is a guest user. should always return false.",
//                 "type": "bool"
//             },
//             {
//                 "name": "languages",
//                 "description": "Facebook Pages representing the languages this person knows",
//                 "type": "list<experience>"
//             },
//             {
//                 "name": "last_name",
//                 "description": "The person's last name",
//                 "type": "string"
//             },
//             {
//                 "name": "link",
//                 "description": "A link to the person's Timeline. The link will only resolve if the person clicking the link is logged into Facebook and is a friend of the person whose profile is being viewed.",
//                 "type": "string"
//             },
//             {
//                 "name": "location",
//                 "description": "The person's current location as entered by them on their profile. This field requires the `user_location` permission.",
//                 "type": "page"
//             },
//             {
//                 "name": "meeting_for",
//                 "description": "What the person is interested in meeting for",
//                 "type": "list<string>"
//             },
//             {
//                 "name": "middle_name",
//                 "description": "The person's middle name",
//                 "type": "string"
//             },
//             {
//                 "name": "name",
//                 "description": "The person's full name",
//                 "type": "string"
//             },
//             {
//                 "name": "name_format",
//                 "description": "The person's name formatted to correctly handle Chinese, Japanese, or Korean ordering",
//                 "type": "string"
//             },
//             {
//                 "name": "payment_pricepoints",
//                 "description": "The person's payment pricepoints",
//                 "type": "paymentpricepoints"
//             },
//             {
//                 "name": "political",
//                 "description": "*Returns no data as of April 4, 2018.*",
//                 "type": "string"
//             },
//             {
//                 "name": "profile_pic",
//                 "description": "The profile picture URL of the Messenger user. The URL will expire.",
//                 "type": "string"
//             },
//             {
//                 "name": "quotes",
//                 "description": "The person's favorite quotes",
//                 "type": "string"
//             },
//             {
//                 "name": "relationship_status",
//                 "description": "*Returns no data as of April 4, 2018.*",
//                 "type": "string"
//             },
//             {
//                 "name": "shared_login_upgrade_required_by",
//                 "description": "The time that the shared login needs to be upgraded to Business Manager by",
//                 "type": "timestamp"
//             },
//             {
//                 "name": "short_name",
//                 "description": "Shortened, locale-aware name for the person",
//                 "type": "string"
//             },
//             {
//                 "name": "significant_other",
//                 "description": "The person's significant other",
//                 "type": "user"
//             },
//             {
//                 "name": "sports",
//                 "description": "Sports played by the person",
//                 "type": "list<experience>"
//             },
//             {
//                 "name": "supports_donate_button_in_live_video",
//                 "description": "Whether the user can add a Donate Button to their Live Videos",
//                 "type": "bool"
//             },
//             {
//                 "name": "token_for_business",
//                 "description": "A token that is the same across a business's apps. Access to this token requires that the person be logged into your app or have a role on your app. This token will change if the business owning the app changes",
//                 "type": "string"
//             },
//             {
//                 "name": "video_upload_limits",
//                 "description": "Video upload limits",
//                 "type": "videouploadlimits"
//             },
//             {
//                 "name": "website",
//                 "description": "*Returns no data as of April 4, 2018.*",
//                 "type": "string"
//             }
//         ],
//         "type": "user",
//         "connections": {
//             "accounts": "https://graph.facebook.com/v19.0/2598587730299741/accounts?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "ad_studies": "https://graph.facebook.com/v19.0/2598587730299741/ad_studies?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "adaccounts": "https://graph.facebook.com/v19.0/2598587730299741/adaccounts?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "albums": "https://graph.facebook.com/v19.0/2598587730299741/albums?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "apprequestformerrecipients": "https://graph.facebook.com/v19.0/2598587730299741/apprequestformerrecipients?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "apprequests": "https://graph.facebook.com/v19.0/2598587730299741/apprequests?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "assigned_ad_accounts": "https://graph.facebook.com/v19.0/2598587730299741/assigned_ad_accounts?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "assigned_business_asset_groups": "https://graph.facebook.com/v19.0/2598587730299741/assigned_business_asset_groups?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "assigned_pages": "https://graph.facebook.com/v19.0/2598587730299741/assigned_pages?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "assigned_product_catalogs": "https://graph.facebook.com/v19.0/2598587730299741/assigned_product_catalogs?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "avatars": "https://graph.facebook.com/v19.0/2598587730299741/avatars?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "business_users": "https://graph.facebook.com/v19.0/2598587730299741/business_users?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "businesses": "https://graph.facebook.com/v19.0/2598587730299741/businesses?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "conversations": "https://graph.facebook.com/v19.0/2598587730299741/conversations?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "custom_labels": "https://graph.facebook.com/v19.0/2598587730299741/custom_labels?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "events": "https://graph.facebook.com/v19.0/2598587730299741/events?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "feed": "https://graph.facebook.com/v19.0/2598587730299741/feed?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "friends": "https://graph.facebook.com/v19.0/2598587730299741/friends?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "fundraisers": "https://graph.facebook.com/v19.0/2598587730299741/fundraisers?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "groups": "https://graph.facebook.com/v19.0/2598587730299741/groups?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "ids_for_apps": "https://graph.facebook.com/v19.0/2598587730299741/ids_for_apps?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "ids_for_business": "https://graph.facebook.com/v19.0/2598587730299741/ids_for_business?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "ids_for_pages": "https://graph.facebook.com/v19.0/2598587730299741/ids_for_pages?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "likes": "https://graph.facebook.com/v19.0/2598587730299741/likes?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "live_videos": "https://graph.facebook.com/v19.0/2598587730299741/live_videos?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "music": "https://graph.facebook.com/v19.0/2598587730299741/music?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "payment.subscriptions": "https://graph.facebook.com/v19.0/2598587730299741/payment.subscriptions?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "payment_transactions": "https://graph.facebook.com/v19.0/2598587730299741/payment_transactions?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "permissions": "https://graph.facebook.com/v19.0/2598587730299741/permissions?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "personal_ad_accounts": "https://graph.facebook.com/v19.0/2598587730299741/personal_ad_accounts?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "photos": "https://graph.facebook.com/v19.0/2598587730299741/photos?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "picture": "https://graph.facebook.com/v19.0/2598587730299741/picture?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "posts": "https://graph.facebook.com/v19.0/2598587730299741/posts?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "rich_media_documents": "https://graph.facebook.com/v19.0/2598587730299741/rich_media_documents?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD",
//             "videos": "https://graph.facebook.com/v19.0/2598587730299741/videos?access_token=EABprvJULjNYBO1QYxVbuBO1N8uGCieReHiSxqVEfjXLpfmEwhOUVHOT2p7ETYImuM86IsUPNuAikajNZAsEBgVDYYHOZCkXn7GFjPjP6H5QPZCqdZCCDZB6VQ2syWefIliwVVqUa9ZCLVFDq3qe3w7zd6ZAQLZA6jZBBZB31kCqxXwAhsPXQNuHkEvBu2EvPtJVNIjx2WasvTa7ZCDTCrO79wZDZD"
//         }
//     },
//     "id": "2598587730299741"
// }
