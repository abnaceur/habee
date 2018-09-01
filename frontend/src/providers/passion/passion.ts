import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import "rxjs/add/operator/map";
import { environment as ENV } from '../../environments/environment' ;

/*
  Generated class for the PassionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PassionProvider {

  constructor(public http: Http) {
    console.log('Hello PassionProvider Provider');
  }

  getAllPassions (token, activeCommunity) {
    console.log('Token 12:', token);
    const header = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('Accept', 'application/json');
    header.append('Authorization', 'Bearer ' + token);
   
    return this.http.get(ENV.BASE_URL + '/passions/community/com_tes_2016_9',
      { headers: header })
      .map(response => response.json());
  }
}
