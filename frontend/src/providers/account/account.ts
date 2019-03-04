import {
  Injectable
} from '@angular/core';

import {
  Http,
  Headers
} from '@angular/http';

import {
  UtilsProvider
} from '../../providers/utils/utils';

import {
  environment as ENV
} from '../../environments/environment';

/*
  Generated class for the AccountProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AccountProvider {

  constructor(
    public utils: UtilsProvider,
    public http: Http
    ) {
    console.log('Hello AccountProvider Provider');
  }

  getAccountInfo (userInfo) {
    let header = this.utils.inihttpHeaderWIthToken(userInfo.token)

    return this.http.get(ENV.BASE_URL + '/users/account/info/' + userInfo.userId,
      { headers: header })
      .map(response => response.json());
  }

  updateUserAccount (data, userInfo) {
    let header = this.utils.inihttpHeaderWIthToken(userInfo.token)

    return this.http.put(ENV.BASE_URL + '/users/account/info/' + userInfo.userId,
      data,
      { headers: header })
      .map(response => response.json().code);
  }

  deleteUserAccount(userInfo) {
    let header = this.utils.inihttpHeaderWIthToken(userInfo.token)
    
    return this.http.post(ENV.BASE_URL + '/users/account/delete/' + userInfo.userId,
      "",
      { headers: header })
      .map(response => response.json().code);
  }

  updateNotifiacationStatus(userInfo, notifStatus) {
    let header = this.utils.inihttpHeaderWIthToken(userInfo.token)
    
      return this.http.put(ENV.BASE_URL + '/users/notification/update/' + userInfo.userId,
      {notifStatus},
      { headers: header })
      .map(response => response.json().code);
    }

}
