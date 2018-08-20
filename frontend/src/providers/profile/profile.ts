import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import "rxjs/add/operator/map";
import { environment as ENV } from '../../environments/environment' ;

/*
  Generated class for the ProfileProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProfileProvider {

  constructor(public http: Http) {
    console.log('Hello ProfileProvider Provider');
  }

  getUserProfileByCommunityId (token, userId, activeCommunity ) {
    console.log('Token 12:', token);
    const header = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('Accept', 'application/json');
    header.append('Authorization', 'Bearer ' + token);
   
    return this.http.get(ENV.BASE_URL + '/users/' + userId + '/' + activeCommunity,
      { headers: header })
      .map(response => console.log(response));
  }
}