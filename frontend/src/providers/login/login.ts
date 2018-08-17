import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import "rxjs/add/operator/map";
import { environment as ENV } from '../../environments/environment' ;

@Injectable()
export class LoginProvider {

  constructor(public http: Http) {
    console.log('Hello LoginProvider Provider');
  }

  loginUser(email, password) {
    const header = new Headers();
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
