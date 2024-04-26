import { Injectable } from '@nestjs/common';

@Injectable()
export class FacebookService {
  constructor() {}

  async getPagesForUser(userAccessToken) {
    const response = await (
      await fetch(
        'https://graph.facebook.com/v19.0/me/accounts?access_token=' +
          userAccessToken,
      )
    ).json();

    const pageArray = response.data.map((element: any) => {
      return {
        pageName: element.name,
        pageAccessToken: element.access_token,
        pageId: element.id,
      };
    });
    return pageArray;
  }

  async sendResponseToUser(payload: {
    pageId: string;
    pageAccessToken: string;
    recipientId: string;
    message: string;
  }) {
    const url = `https://graph.facebook.com/v19.0/${payload.pageId}/messages?access_token=${payload.pageAccessToken}`;
    const data = {
      recipient: {
        id: payload.recipientId,
      },
      messaging_type: 'RESPONSE',
      message: {
        text: payload.message,
      },
    };

    fetch(url, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
      .then((response) => response.json()) // parses JSON response into native JavaScript objects
      .then((data) => {
        console.log(data); // JSON data parsed by `response.json()` call
      })
      .catch((error) => console.error('Error:', error));
  }
}
