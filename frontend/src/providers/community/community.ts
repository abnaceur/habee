import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { environment as ENV } from "../../environments/environment";

@Injectable()
export class CommunityProvider {

  constructor(public http: Http) {
    console.log('Hello CommunityProvider Provider');
  }

  getCommunityById(communityId: string) {
    return this.http.get(ENV.BASE_URL + "/communities" + communityId);
  }

}
