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
    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    return this.http.get(ENV.BASE_URL + '/communities/creator/' + userInfo.userId,
      { headers: header })
      .map(response => response.json());
  }

  getCommunitySelected(com, activeCommunity): Promise<any> {
    let comArray = [];
    com.map(data => {
      data.communityName == activeCommunity ?
        data.selected = "true"
        : data.selected = "false"
      comArray.push(data)
    })
    return new Promise((resolve, reject) => {
      resolve(comArray);
    })
  }

  addCommunity(comInfo, photo, userInfo): Observable<{}> {
    console.log("Inside add community !", photo, comInfo);
    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    if (photo === undefined) {
      return this.http.post(ENV.BASE_URL + '/communities/creator/' + userInfo.userId,
        {
          "communityId": comInfo.communityTitle,
          "communityName": comInfo.communityTitle,
          "communityLogo": photo,
          "communityCreator": userInfo.userId,
          "communityMembers": [userInfo.userId],
          "communityDescripton": comInfo.communityDescription,
          "communityIsActive": true,
        }
        , { headers: header })
        .map(response => response.json());
    } else {
      this.utils.uploadPhoto(photo)
        .then(data => {
          return this.http.post(ENV.BASE_URL + '/communities/creator/' + userInfo.userId,
            {
              "communityId": comInfo.communityTitle,
              "communityName": comInfo.communityTitle,
              "communityLogo": data,
              "communityCreator": userInfo.userId,
              "communityMembers": [userInfo.userId],
              "communityDescripton": comInfo.communityDescription,
              "communityIsActive": true,
            }
            , { headers: header })
            .map(response => response.json());
        })
    }
  }

  updateSelectedCommunity(comId, userInfo): Observable<{}> {

    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    return this.http.post(ENV.BASE_URL + '/communities/selected/' + comId + "/" + userInfo.userId,
      { headers: header })
      .map(response => response.json());
  }

}
