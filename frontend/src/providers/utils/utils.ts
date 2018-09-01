import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import "rxjs/add/operator/map";
import { environment as ENV } from '../../environments/environment';


/*
  Generated class for the UtilsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UtilsProvider {

  constructor(public http: Http) {
    console.log('Hello UtilsProvider Provider');
  }

  filter_array(arrayIn) {
    let index = -1;
    const arr_length = arrayIn ? arrayIn.length : 0;
    let resIndex = -1;
    const result = [];

    while (++index < arr_length) {
      const value = arrayIn[index];

      if (value) {
        result[++resIndex] = value;
      }
    }
    return result;
  }

  inihttpHeaderWIthToken(token) {
    const header = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('Accept', 'application/json');
    header.append('Authorization', 'Bearer ' + token);

    return header;
  }
}
