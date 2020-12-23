import { Injectable } from "@angular/core";

import { Http, Headers } from "@angular/http";

import "rxjs/add/operator/map";

import { environment as ENV } from "../../environments/environment";

import { UtilsProvider } from "../../providers/utils/utils";

/*
  Generated class for the ProfileProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProfileProvider {
  private userPassionsList = [];
  private userSubPassionList;
  private getUserSubPassions = [];

  constructor(public http: Http, public utils: UtilsProvider) {
  }

  getUserProfileByCommunityId(userInfo) {
    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    return this.http.get(ENV.BASE_URL + "/users/" + userInfo.userId + "/" + userInfo.activeCommunity,
      { headers: header }
    )
      .map(response => response.json());
  }
  
  postProfile(userInfo, profileName, photo, header) {

    return this.http
      .put(
        ENV.BASE_URL +
        "/users/profile/user/" +
        userInfo.userId +
        "/community/" +
        userInfo.activeCommunity,
        {
          profileFirstname: profileName.profileFirstname,
          profileLastname: profileName.profileLastname,
          profileImage: photo
        },
        { headers: header }
      )
      .map(response => response.json().code);
  }

  editProfil(profileName, photo, userInfo) {
    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);
    return this.http
      .put(
        ENV.BASE_URL +
        "/users/profile/user/" +
        userInfo.userId +
        "/community/" +
        userInfo.activeCommunity,
        {
          profileFirstname: profileName.profileFirstname,
          profileLastname: profileName.profileLastname,
          profileImage: photo
        },
        { headers: header }
      )
      .map(response => response.json().code);
  }
}
