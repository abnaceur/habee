import {
  Injectable
} from '@angular/core';

import {
  Http,
  Headers
} from '@angular/http';

import "rxjs/add/operator/map";

import {
  UtilsProvider
} from '../../providers/utils/utils';

import {
  environment as ENV
} from '../../environments/environment';

@Injectable()
export class LoginProvider {

  constructor(
    public http: Http,
    public utils: UtilsProvider,
  ) {
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

  updateUserNbrConnection(token, userId) {

    const header = this.utils.inihttpHeaderWIthToken(token);

    return this.http.put(ENV.BASE_URL + '/users/firstConnection/' + userId,
      {
        firstConnection: 0
      },
      { headers: header })
      .map(response => response.json());
  }

  updateEventList(info) {

    const header = this.utils.inihttpHeaderWIthToken(info.token);

    return this.http.put(ENV.BASE_URL + '/events/all/isOver/' + info.userId + '/' + info.activeCommunity,
      { headers: header })
      .map(response => response.json());
  }

  createANewAccount(value) {
    return this.http.post(ENV.BASE_URL + '/users/create/newaccount', value)
      .map(response => response.json());
  }
}