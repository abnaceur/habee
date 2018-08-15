import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
import { environment as ENV } from '../../environments/environment' ;

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginProvider {

  constructor(public http: Http) {
    console.log('Hello LoginProvider Provider');
  }

  loginUser(email, password) {
    let header = new Headers();
    header.append('Content-Type', 'application/json');

    return this.http.post(ENV.BASE_URL + '/users/login',
      {
        credentials: {
          email: email,
          password: password
        }
      },
      { headers: header })
      .map(response => response.json());
  }
}
