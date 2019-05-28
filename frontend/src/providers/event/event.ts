import { HttpClient } from '@angular/common/http';

import {
  Injectable
} from '@angular/core';

import {
  Http,
  Headers
} from '@angular/http';

import { Socket } from 'ng-socket-io';

import {
  UtilsProvider
} from '../../providers/utils/utils';

import {
  environment as ENV
} from '../../environments/environment';

import {
  FileTransfer,
  FileTransferObject,
  FileUploadOptions
} from '@ionic-native/file-transfer';

import {
  File
} from '@ionic-native/file';

import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController
} from "ionic-angular";
import { v } from '@angular/core/src/render3';

/*
  Generated class for the EventProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EventProvider {
  private uploadedImage;

  constructor(
    public http: Http,
    private socket: Socket,
    public utils: UtilsProvider,
    private file: File,
    private transfer: FileTransfer,
    private loadingCTRL: LoadingController
  ) {
  }

  getEventsByCommunityId(userInfo) {

    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    return this.http.get(ENV.BASE_URL + '/events/community/' + userInfo.activeCommunity,
      { headers: header })
      .map(response => response.json());
  }

  getFilteredAllEventsByCommunityId(userInfo, page) {
    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);


    return this.http.get(ENV.BASE_URL + '/events/filtered/user/' + userInfo.userId +'/community/' + userInfo.activeCommunity + '/page/' + page,
      { headers: header })
      .map(response => response.json());
  }

  getEventSubscription(eventId, userInfo) {
    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    return this.http.put(ENV.BASE_URL + '/events/' + eventId + '/user/' + userInfo.userId + '/community/' + userInfo.activeCommunity,
      {}, { headers: header })
      .map(response => response.json());
  }

  getEventById(eventId, token) {
    const header = this.utils.inihttpHeaderWIthToken(token);

    return this.http.get(ENV.BASE_URL + '/events/' + eventId,
      { headers: header })
      .map(response => response.json());
  }

  getUserInformation(userInfo) {
    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    return this.http.get(ENV.BASE_URL + '/users/' + userInfo.userId,
      { headers: header })
      .map(response => response.json());
  }

  // TODO DRY FUNCTION TO MOVE TTO UTILS
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
        fileName: 'eventImage' + random + '.jpg',
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

  addEventByCommunity(event, userInfo, uploadedImage, listCommunity) {
  const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    return this.http.post(ENV.BASE_URL + '/events',
      {
        "eventId": event.eventTitle + "_" + Math.floor(Math.random() * 100000) + "_" + userInfo.userId,
        "eventCommunity": listCommunity,
        "eventCreator": userInfo.userId,
        "eventName": event.eventTitle,
        "eventStartDate": event.eventStartDate,
        "eventEndDate": event.eventEndDate,
        "eventStartHour": event.eventStartHour,
        "eventEndHour": event.eventEndHour,
        "eventDescription": event.eventDescription,
        "eventLocation": event.eventLocation,
        "nbrParticipants": event.eventNbrParticipants,
        "eventCategory": event.eventCategory,
        "eventIsPublic": event.eventIsPublic,
        "eventPhoto": uploadedImage,
      },
      { headers: header })
      .map(response => response.json());
  }

  getAllProposedEvevnstByUser(userInfo) {
    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    return this.http.get(ENV.BASE_URL + '/events/user/' + userInfo.userId + '/community/' + userInfo.activeCommunity,
      { headers: header })
      .map(response => response.json());
  }

  editEvent(event, uploadedImage, userInfo, tabparas) {

    const header = this.utils.inihttpHeaderWIthToken(tabparas.token);

    return this.http.put(ENV.BASE_URL + "/events/edit/" + event.eventId + '/community/' + tabparas.activeCommunity,
      {
        "check": 0,
        "dateOfCreation": userInfo.dateOfCreation,
        "dateOfLastUpdate": new Date,
        "eventCategory": event.eventCategory,
        "eventCommunity": event.eventCommunity,
        "eventCreator": userInfo.eventCreator,
        "eventDescription": event.eventDescription, 
        "eventEndDate": event.eventEndDate,
        "eventEndHour": event.eventEndHour,
        "eventId": userInfo.eventId,
        "eventIsDeleted": false,
        "eventIsOver": false,
        "eventIsPublic": false,
        "eventLocation": event.eventLocation,
        "eventName": event.eventTitle,
        "eventPhoto": uploadedImage,
        "eventStartDate": event.eventStartDate,
        "eventStartHour": event.eventStartHour,
        "nbrParticipants": event.nbrParticipants,
        "participants": userInfo.participants,
        "_id": userInfo._id
      },
      { headers: header })
      .map(response => response.json());
  }

  deleteTheiEvent(event, userInfo) {
    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    return this.http.put(ENV.BASE_URL + "/events/edit/" + event.eventId + '/community/' + userInfo.activeCommunity,
      {
        "check": 1,
        "eventId": event.eventId,
        "eventCommunity": userInfo.activeCommunity,
        "eventCreator": userInfo.userId,
        "eventName": event.eventName,
        "eventStartDate": event.eventStartDate,
        "eventEndDate": event.eventEndDate,
        "eventStartHour": event.eventStartHour,
        "eventEndHour": event.eventEndHour,
        "eventDescription": event.eventDescription,
        "eventLocation": event.eventLocation,
        "participants": event.participants,
        "nbrParticipants": event.eventNbrParticipants,
        "eventIsDeleted": true,
      },
      { headers: header })
      .map(response => response.json());
  }


  checkFilterOptions(filter) {
    let activeFilters = [];
    let i = 0;

    if (filter.SportValue == true) {
      activeFilters[i] = "Sports";
      i++;
    }

    if (filter.ArtsValue == true) {
      activeFilters[i] = "Arts";
      i++;
    }

    if (filter.cultureValue == true) {
      activeFilters[i] = "Culture";
      i++;
    }

    if (filter.MediaValue == true) {
      activeFilters[i] = "Media";
      i++;
    }

    if (filter.musicValue == true) {
      activeFilters[i] = "Music";
      i++;
    }

    if (filter.socialValue == true) {
      activeFilters[i] = "Social";
      i++;
    }

    if (filter.internValue == true) {
      activeFilters[i] = "International";
      i++;
    }

    if (filter.businessValue == true) {
      activeFilters[i] = "Business";
      i++;
    }

    if (filter.communityValue == true) {
      activeFilters[i] = "Communite";
      i++;
    }
    if (filter.santeValue == true) {
      activeFilters[i] = "Sante";
      i++;
    }

    if (filter.itValue == true) {
      activeFilters[i] = "Science et technologie";
      i++;
    }

    if (filter.lifestyleValue == true) {
      activeFilters[i] = "Style de vie";
      i++;
    }

    if (filter.partyValue == true) {
      activeFilters[i] = "Fete";
      i++;
    }

    if (filter.meetingValue == true) {
      activeFilters[i] = "Rencontre";
      i++;
    }

    if (filter.WorkshopValue == true) {
      activeFilters[i] = "Workshop";
      i++;
    }

    return new Promise(resolve => {
      resolve(activeFilters);
    });

  }

  eventApplyFilter(filter, allEvents, nbrFilter) {

    let filteredEvent = [];
    let i = 0;

    allEvents === [] ? allEvents.map(event => {
      while (i < nbrFilter) {
        if (event.eventCategory == filter[i]) {
          filteredEvent.push(event)
        }
        i++;
      }
      i = 0;
    }) : filteredEvent = [];

    return new Promise(resolve => {
      resolve(filteredEvent);
    });
  }


  getFilterOptions(userInfo) {
    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    return this.http.get(ENV.BASE_URL + '/events/filter/' + userInfo.userId + '/community/' + userInfo.activeCommunity,
      { headers: header })
      .map(response => response.json());
  }

  saveFilterOptions(filter, userInfo) {
    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    return this.http.post(ENV.BASE_URL + '/events/filter/' + userInfo.userId + '/community/' + userInfo.activeCommunity,
    filter,
      { headers: header })
      .map(response => response.json());
  }


  getComments(userInfo, event) {
    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    return this.http.get(ENV.BASE_URL + '/events/comments/' + event.eventId + '/community/' + event.eventCommunity,
      { headers: header })
      .map(response => response.json());
  }

  emitSendMsg (msg) {
    this.socket.emit('send-message', msg);
  }

  checkIfNotifIsActive (filter, activeCategory) {

    return new Promise((resolve, reject) => {
      let i = 0;
      if (filter.SportValue == true && "Sports" == activeCategory) i++;
      if (filter.ArtsValue == true && "Arts" == activeCategory) i++;
      if (filter.cultureValue == true && "Culture" == activeCategory) i++; 
      if (filter.MediaValue == true && "Media" == activeCategory)  i++;
      if (filter.musicValue == true && "Music" == activeCategory) i++;
      if (filter.socialValue == true && "Social" == activeCategory) i++;
      if (filter.internValue == true && "International" == activeCategory) i++;
      if (filter.businessValue == true && "Business" == activeCategory) i++;
      if (filter.communityValue == true && "Communite" == activeCategory) i++;
      if (filter.santeValue == true && "Sante" == activeCategory) i++;
      if (filter.partyValue == true && "Science et technologie" == activeCategory) i++;
      if (filter.lifestyleValue == true && "Style de vie" == activeCategory) i++;
      if (filter.partyValue == true && "Fete" == activeCategory) i++;
      if (filter.meetingValue == true && "Rencontre" == activeCategory) i++;
      if (filter.WorkshopValue == true && "Workshop" == activeCategory) i++;
  
      resolve(i)
    }) 
  }

}