import { Injectable } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { environment as ENV } from "../../environments/environment";

@Injectable()
export class CommunityProvider {

  constructor(public http: Http) {
    console.log('Hello CommunityProvider Provider');
  }

  getCommunityById(communityId: string, token: string) {
    console.log("IN COMMUNITY PROVIDER/ retrieve: ", communityId);
    const headers: Headers = new Headers({"authorization": token});
    return this.http.get(ENV.BASE_URL + "/communities/" + communityId, {headers: headers});
  }

}
