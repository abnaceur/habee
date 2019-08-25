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
  Generated class for the AddContactProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AddContactProvider {

  constructor(
    public utils: UtilsProvider,
    public http: Http

  ) {
  }

  sendContactInvitation (contactArray, userInfo) {
    let header = this.utils.inihttpHeaderWIthToken(userInfo.token)

    return this.http.post(ENV.BASE_URL + '/users/invite/contacts/' + userInfo.userId + "/" + userInfo.activeCommunity,
      contactArray,
      { headers: header })
      .map(response => response.json());
  }
  
  sendContactQrCodeInvitation (contactArray, userInfo) {
    let header = this.utils.inihttpHeaderWIthToken(userInfo.token)

    return this.http.post(ENV.BASE_URL + '/users/invite/contactsbyqrcode/' + userInfo.userId,
      contactArray,
      { headers: header })
      .map(response => response.json());
  }
  

  getQrCodeInvitation (contactArray, userInfo) {
    let check = 0;
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return new Promise((resolve, reject) => {
      contactArray.map(cc => {
        if (cc.value === "") {
          cc.check = "Ce champ doit etre rempli"
          check++;
        } else if (re.test(cc.value) === false) {
          check++;
          cc.check = cc.value + " : cet email n'est pas valid";
        } else if (cc.communities.length == 0) {
          check++;
          cc.check = "Vous devez l'inviter dans au moins 1 Team";   
        }
      })
      if (check === 0) {
        this.sendContactQrCodeInvitation(contactArray, userInfo)
          .subscribe(data => {
            resolve(data.msg)
          })
      } else {
        resolve(contactArray)
      }
    })
  }

  isFieldEmpty(contactArray, userInfo) {
    let check = 0;
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return new Promise((resolve, reject) => {
      contactArray.map(cc => {
        if (cc.value === "") {
          cc.check = "Ce champ doit etre rempli"
          check++;
        } else if (re.test(cc.value) === false) {
          check++;
          cc.check = cc.value + " : cet email n'est pas valid";
        } else if (cc.communities.length == 0) {
          check++;
          cc.check = "Vous devez l'inviter dans au moins 1 Team";   
        }
      })
      if (check === 0) {
        this.sendContactInvitation(contactArray, userInfo)
          .subscribe(data => {
            resolve(data.msg)
          })
      } else {
        resolve(contactArray)
      }
    })
  }
}
