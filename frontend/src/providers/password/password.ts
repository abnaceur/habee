import { Injectable } from "@angular/core";

import { Http, Headers } from "@angular/http";

import { UtilsProvider } from "../utils/utils";

import { environment as ENV } from "../../environments/environment";

/*
  Generated class for the PasswordProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PasswordProvider {
  constructor(private utils: UtilsProvider, private http: Http) {
    console.log("Hello PasswordProvider Provider");
  }

  checkPasswords(psw, userInfo) {
    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    console.log("here");
    return this.http
      .post(
        ENV.BASE_URL + "/users/account/psw/user/" + userInfo.userId,
        {
          oldPassword: psw
        },
        { headers: header }
      )
      .map(response => response.json().code);
  }

  updatePassword(psw, userInfo) {
    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    return this.http
      .put(
        ENV.BASE_URL + "/users/account/psw/user/" + userInfo.userId,
        {
          newPassword: psw
        },
        { headers: header }
      )
      .map(response => response.json().code);
  }

  resetPassword(email) {
    return this.http
      .post(ENV.BASE_URL + "/users/reset/email/"+ email, "")
      .map(response => response.json().code);
  }
}
