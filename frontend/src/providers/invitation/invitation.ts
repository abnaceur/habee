import { Injectable } from "@angular/core";

import { Http, Headers } from "@angular/http";

import "rxjs/add/operator/map";

import { environment as ENV } from "../../environments/environment";

import { UtilsProvider } from "../../providers/utils/utils";

/*
  Generated class for the InvitationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class InvitationProvider {
  constructor(public http: Http, public utils: UtilsProvider) {
    console.log("Hello InvitationProvider Provider");
  }

  getAllUserInvitations(userInfo) {
    console.log("UserId :", userInfo);
    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    return this.http
      .get(
        ENV.BASE_URL +
          "/users/list/invitation/" +
          userInfo.userId +
          "/community/" +
          userInfo.activeCommunity,
        { headers: header }
      )
      .map(response => response.json().data);
  }

  updateNotification(userInfo) {
    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    return this.http
      .put(
        ENV.BASE_URL +
          "/users/update/invitation/" +
          userInfo.userId +
          "/community/" +
          userInfo.activeCommunity,
        { headers: header }
      )
      .map(response => response.json().data);
  }

  getCountNotification (userInfo) {
    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    return this.http
      .get(
        ENV.BASE_URL +
          "/users/count/invitation/" +
          userInfo.userId +
          "/community/" +
          userInfo.activeCommunity,
        { headers: header }
      )
      .map(response => response.json().count);
    
  }

  acceptedInvitatioo(invit, userInfo) {
    invit.status = "accepted"

    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    return this.http
      .post(
        ENV.BASE_URL +
          "/users/invitation/accepted/" +
          userInfo.userId +
          "/community/" +
          userInfo.activeCommunity, invit,
        { headers: header }
      )
      .map(response => response.json().code); 
  }

  rejectedInvitation (invit, userInfo) {
    invit.status = "rejected"

    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    return this.http
      .post(
        ENV.BASE_URL +
          "/users/invitation/rejected/" +
          userInfo.userId +
          "/community/" +
          userInfo.activeCommunity, invit,
        { headers: header }
      )
      .map(response => response.json().code); 
  }

}
