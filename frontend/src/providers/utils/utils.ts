import { Injectable } from '@angular/core';

import { 
  Http, 
  Headers 
} from '@angular/http';

import "rxjs/add/operator/map";

import { 
  environment as ENV 
} from '../../environments/environment';

import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  ModalController
} from 'ionic-angular';



/*
  Generated class for the UtilsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UtilsProvider {

  constructor(
    public http: Http,
    private toastController: ToastController,
  ) {
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

  notification(msg, side) {
      let subscribedToast = this.toastController.create({
        message: msg,
        duration: 2000, 
        position: side,
        cssClass: "subscribedClass"
      });
      subscribedToast.present()
  }

}
