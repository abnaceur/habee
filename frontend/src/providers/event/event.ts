import { HttpClient } from '@angular/common/http';

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

  addEventByCommunity(event, userInfo, uploadedImage) {

    console.log("uploadedImage :", uploadedImage)

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
        "eventCategory": event.eventCategory,
        "eventPhoto": uploadedImage,
      },
      { headers: header })
      .map(response => response.json());
  }

  getAllProposedEvevnstByUser(userInfo) {
    console.log("getAllProposedEvevnstByUser : ", userInfo);
    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    return this.http.get(ENV.BASE_URL + '/events/user/' + userInfo.userId + '/community/' + userInfo.activeCommunity,
    { headers: header })
    .map(response => response.json());
  }

  editEvent(event, uploadedImage, userInfo) {
    console.log("Event to be edited ", event, uploadedImage);
    console.log("UserInfo : ", userInfo);

    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    return this.http.put(ENV.BASE_URL + "/events/edit/" + event.eventId + '/community/' + userInfo.activeCommunity,
      {
        "eventId": event.eventId,
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
        "eventPhoto": uploadedImage,
      },
      { headers: header })
      .map(response => response.json());
  }

  deleteTheiEvent(event, userInfo) {
    console.log("Event to be edited ", event, userInfo);

    const header = this.utils.inihttpHeaderWIthToken(userInfo.token);

    return this.http.put(ENV.BASE_URL + "/events/edit/" + event.eventId + '/community/' + userInfo.activeCommunity,
      {
        "eventId": event.eventId,
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
      console.log("HERE")
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

    if (filter.communityValue == true){
      activeFilters[i] = "Communite";
      i++;
    }  
    if (filter.santeValue == true){
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

    console.log(filter, allEvents)
    allEvents.map(event => {
      while (i < nbrFilter) {
        if (event.eventCategory == filter[i]) {
          filteredEvent.push(event)
        }
        i++;
      }
      i = 0;
    })

    return new Promise(resolve => {
      resolve(filteredEvent);
    });
  }
}