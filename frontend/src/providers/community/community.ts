import { 
  Injectable 
} from '@angular/core';

import { 
  Http 
} from "@angular/http";

import { 
  environment as ENV 
} from "../../environments/environment";


import {
  UtilsProvider
} from '../../providers/utils/utils';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { SubscribableOrPromise, Observable } from 'rxjs/Observable';


@Injectable()
export class CommunityProvider {

  constructor(
    public http: Http,
    public utils: UtilsProvider,
  ) {
    console.log('Hello CommunityProvider Provider');
  }

  getCommunityById(communityId: string) {
    return this.http.get(ENV.BASE_URL + "/communities" + communityId);
  }

  getCommunitiesbyCreator(userInfo) {
    console.log("userId OOOO : ", userInfo);
    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    return this.http.get(ENV.BASE_URL + '/communities/creator/' + userInfo.userId,
      { headers: header })
      .map(response => response.json());
  }

  getCommunitySelected(com, userId): SubscribableOrPromise {
    let comArray = [];

    console.log("AAA : ", userId, com)
    com.map(data => {
      data.communityCreator == userId ?
      data.selected = "true"
      : data.selected = "false"
      comArray.push(data)
    })

    console.log("ComArray :", comArray);
    return new Promise ((resolve, reject) => {
      resolve(comArray);
    })
  }

}
