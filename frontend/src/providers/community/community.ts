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
  }

  getCommunityById(userInfo, comId) {
    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    return this.http.get(ENV.BASE_URL + "/communities/" + comId,
    { headers: header })
    .map(response => response.json().community[0]);
  }

  getCommunitiesByParticipation(userInfo) {
    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    return this.http.get(ENV.BASE_URL + '/communities/byparticipation/' + userInfo.userId,
      { headers: header })
      .map(response => response.json().data);
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
      data.communityId == activeCommunity ?
        data.selected = "true"
        : data.selected = "false"
      comArray.push(data)
    })
    return new Promise((resolve, reject) => {
      resolve(comArray);
    })
  }


  postCommunity(userInfo, comInfo, data, header) {
    return this.http.post(ENV.BASE_URL + '/communities/creator/' + userInfo.userId,
      {
        //TODO GEENARTE AN ID FOR COMMUNITY ID
        "communityId": comInfo.communityTitle,
        "communityName": comInfo.communityTitle,
        "communityLogo": data,
        "communityCreator": userInfo.userId,
        "communityMembers": [userInfo.userId],
        "communityDescripton": comInfo.communityDescription,
        "communityIsActive": true,
      }
      , { headers: header })
      .map(response => response.json().count);
  }

  putCommunity (communityId, userInfo, communityDetails){    
    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    return this.http.put(ENV.BASE_URL + '/communities/' + communityId,
    {
      "communityName": communityDetails.communityTitle,
      "communityLogo": communityDetails.logo,
      "communityDescripton": communityDetails.communityDescription,
    }
    , { headers: header })
    .map(response => response.json().code);
  }

  addCommunity(comInfo, photo, userInfo) {
    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    if (photo === undefined) {
      return new Promise((resolve, reject) => {
        this.postCommunity(userInfo, comInfo, photo, header)
          .subscribe(data => {
           resolve(data)
          })
      })
    } else {
      this.utils.uploadPhoto(photo)
        .then(data => {
          return new Promise((resolve, reject) => {
            this.postCommunity(userInfo, comInfo, data, header)
              .subscribe(data => {
                return resolve(data);
              })
          })
        })
    }
  }

  updateSelectedCommunity(comId, userInfo) {

    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    return this.http.post(ENV.BASE_URL + '/communities/selected/' + comId + "/" + userInfo.userId,
    {}, { headers: header })
      .map(response => response.json().count);
  }

  deleteCommunity(userInfo, communityId) {
    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    return this.http.put(ENV.BASE_URL + '/communities/delete/' + communityId,
      { headers: header })
      .map(response => response.json().code);
  }

    getCommunityDetails(userInfo, communityId) {
    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    return this.http.get(ENV.BASE_URL + '/communities/details/' + communityId,
      { headers: header })
      .map(response => response.json());
  }

}
