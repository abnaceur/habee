import { Injectable } from "@angular/core";

import { Http, Headers } from "@angular/http";

import { environment as ENV } from "../../environments/environment";

import { UtilsProvider } from "../../providers/utils/utils";

/*
  Generated class for the RemoveCommunityFromContactProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RemoveCommunityFromContactProvider {
  constructor(public http: Http, public utils: UtilsProvider) {
    console.log("Hello RemoveCommunityFromContactProvider Provider");
  }

  removeCommunity(userInfo, contactId, communityId) {
    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    return this.http.put(ENV.BASE_URL + '/users/contact/' +  contactId +'/community/'+ communityId ,
    {},
      { headers: header })
      .map(response => response.json().code);
  }
}
