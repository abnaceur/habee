import { Injectable } from '@angular/core';

import { 
  Http, 
  Headers 
} from '@angular/http';

import {
  Injectable
} from '@angular/core';

import { 
  environment as ENV 
} from '../../environments/environment';

import {
  UtilsProvider
} from '../../providers/utils/utils';

@Injectable()
export class UserProvider {


  constructor(
    public http: Http,
    public utils: UtilsProvider,
  ) {
  
  }

  getAllUserByCommunityId(info) {
    const header = this.utils.inihttpHeaderWIthToken(info.token);

    return this.http.get(ENV.BASE_URL + '/users/app/community/' + info.activeCommunity,
      { headers: header })
      .map(response => response.json());
  }
}
