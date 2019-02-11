import {
  Injectable
} from '@angular/core';

import {
  Http,
  Headers
} from '@angular/http';

import "rxjs/add/operator/map";

import {
  environment as ENV
} from '../../environments/environment';

import {
  UtilsProvider
} from '../../providers/utils/utils';

/*
  Generated class for the ProfileProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProfileProvider {
  private userPassionsList = [];
  private userSubPassionList;
  private getUserSubPassions = [];

  constructor(
    public http: Http,
    public utils: UtilsProvider) {
    console.log('Hello ProfileProvider Provider');
  }

  getUserProfileByCommunityId(userInfo) {

    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);
    console.log("HHHHHH : ", userInfo)

    return this.http.get(ENV.BASE_URL + '/users/' + userInfo.userId + '/' + userInfo.activeCommunity,
      { headers: header })
      .map(response => response.json());
  }

  getUserPassionsByCommunityId(token, userId, activeCommunity) {

    const header = this.utils.inihttpHeaderWIthToken(token);

    return this.http.get(ENV.BASE_URL + '/users/test_id1/com_tes_2016_9',
      { headers: header })
      .map(response => response.json());
  }

  getUserSubPassionsByCommunityId(response, token, userId, activeCommunity) {
    this.userPassionsList = response.User[0];
    let UserPassions = [];
    UserPassions = this.userPassionsList['passions'];

    //    let nbUserPassions = UserPassions.length;
    let nbUserPassions = 0;

    let i = 0;

    while (nbUserPassions > 0) {
      this.getSubPassions(token, i, UserPassions).then(data => {
        this.getUserSubPassions.push(data);
      });
      nbUserPassions--;
      i++;
    }
    return new Promise(resolve => {
      resolve(this.getUserSubPassions);
    });
  }

  getSubPassions(token, i, userPassionsList) {

    const header = this.utils.inihttpHeaderWIthToken(token);


    return new Promise(resolve => {
      this.http.get(ENV.BASE_URL + '/passions/subpassion/com_tes_2016_9/' + userPassionsList[i],
        { headers: header })
        .map(results => results.json())
        .subscribe(data => {
          data = this.utils.filter_array(data['passion']);
          this.userSubPassionList = data[0];
          resolve(this.userSubPassionList);
        });
    });
  }


}