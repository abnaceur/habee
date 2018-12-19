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
  LoadingController,
  ModalController
} from 'ionic-angular';

import {
  FileTransfer,
  FileTransferObject,
  FileUploadOptions
} from '@ionic-native/file-transfer';

import {
  File
} from '@ionic-native/file';


/*
  Generated class for the UtilsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UtilsProvider {

  constructor(
    public http: Http,
    private file: File,
    private transfer: FileTransfer,
    private loadingCTRL: LoadingController,
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

  uploadPhoto(currentImage) {
    return new Promise((resolve, reject) => {
      let loader = this.loadingCTRL.create({
        content: "uploading..."
      });

      loader.present();

      const fileTransfer: FileTransferObject = this.transfer.create();

      var random = Math.floor(Math.random() * 100);

      let options: FileUploadOptions = {
        fileKey: "file",
        fileName: 'uploadedImage' + random + '.jpg',
        chunkedMode: false,
        httpMethod: "post",
        mimeType: "image/jpeg",
        headers: {}
      }

      fileTransfer.upload(currentImage, ENV.BASE_URL + '/events/mobile/photo/upload', options)
        .then((data) => {
          loader.dismiss();
          resolve(data.response);
          // success
        }, (err) => {
          // error
          loader.dismiss();
          let error = "Error"
          resolve(error);
        })
    })
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

  checkStringExist(str, needle) {
    let i = 0;
    let a = 0;
    let t = 0;
    let z = needle.length;

    while (str[i]) {
      t = i;
      while (str[t] == needle[a]) {
        z--;
        t++;
        a++;
        if (z == 0)
          return true;
      }

      a = 0;
      t = 0;
      z = needle.length;
      i++;
    }
    return false;
  }

}
