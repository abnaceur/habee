import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { UtilsProvider } from '../../providers/utils/utils';
import { environment as ENV } from '../../environments/environment';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { IonicPage, NavController, NavParams, LoadingController } from "ionic-angular";

/*
  Generated class for the EventProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EventProvider {

  constructor(
    public http: Http,
    public utils: UtilsProvider,
    private file: File,
    private transfer: FileTransfer,
    private loadingCTRL: LoadingController
  ) {
    console.log('Hello EventProvider Provider');
  }

  getEventsByCommunityId(token, userId, activeCommunity) {

    const header = this.utils.inihttpHeaderWIthToken(token);

    return this.http.get(ENV.BASE_URL + '/events/community/' + activeCommunity,
      { headers: header })
      .map(response => response.json());
  }


  getEventSubscription(eventId, token, userId, communityId) {
    console.log("inside inscription peovider ");
    const header = this.utils.inihttpHeaderWIthToken(token);

    return this.http.put(ENV.BASE_URL + '/events/' + eventId + '/user/' + userId + '/community/' + communityId,
      { headers: header })
      .map(response => response.json());
  }

  getEventById(eventId, token) {
    const header = this.utils.inihttpHeaderWIthToken(token);

    return this.http.get(ENV.BASE_URL + '/events/' + eventId,
      { headers: header })
      .map(response => response.json());
  }

  getUserInformation(token, userId) {
    const header = this.utils.inihttpHeaderWIthToken(token);

    return this.http.get(ENV.BASE_URL + '/users/' + userId,
      { headers: header })
      .map(response => response.json());
  }

  addEventByCommunity(event, currentImage, userInfo) {

    //data.append('eventPhoto',  currentImage, currentImage.name);


    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    return this.http.post(ENV.BASE_URL + '/events',
      {
        "eventId": event.eventTitle + "_" + Math.floor(Math.random() * 100000),
        "eventCommunity": userInfo.activeCommunity,
        "eventCreator": userInfo.userId,
        "eventName": event.eventTitle,
        "eventStartDate": event.eventStartDate,
        "eventEndDate": event.eventEndDate,
        "eventStartHour": event.eventStartHour,
        "eventEndHour": event.eventEndHour,
        "eventDescription": event.eventDescription,
        "eventLocation": event.eventLocation,
        "nbrParticipants": event.eventNbrParticipants,
        "eventPhoto": currentImage,
      },
      { headers: header })
      .map(response => response.json());
  }

  uploadPhoto(currentImage) {
    let loader = this.loadingCTRL.create({
      content: "uploading..."
    });

    loader.present();

    const fileTransfer: FileTransferObject = this.transfer.create();

    var random = Math.floor(Math.random() * 100);


    let options: FileUploadOptions = {
      
      fileName: 'eventImage' + random + '.jpg',
    }

    fileTransfer.upload(currentImage, ENV.BASE_URL + '/events/mobile/photo/upload', options)
      .then((data) => {
        alert("success")
        console.log("Photo data", data)
        // success
        loader.dismiss();
      }, (err) => {
        // error
        alert('Failed test');
        loader.dismiss();
        console.log("Error photo : ", err)
      })
  }
}

