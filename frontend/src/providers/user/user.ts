import { Injectable } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { environment as ENV } from "../../environments/environment";
import "rxjs/add/operator/map";

@Injectable()
export class UserProvider {

  constructor(public http: Http) {
  }

  getUserById(userId: string, token: string) {
    const headers: Headers = new Headers({"authorization": token});
    return this.http.get(ENV.BASE_URL + "/users/" + userId, {headers: headers});
  }
}
