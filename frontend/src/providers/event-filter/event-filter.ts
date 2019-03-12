import { 
  HttpClient 
} from '@angular/common/http';

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
  Generated class for the EventFilterProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EventFilterProvider {

  constructor(
    public http: Http,
    public utils: UtilsProvider,
    private file: File,
    private transfer: FileTransfer,
    private loadingCTRL: LoadingController) {
  }

  filterlist = {
    SportValue: String,
    ArtsValue: String,
    cultureValue: String, 
    MediaValue: String,
    musicValue: String, 
    socialValue: String, 
    internValue: String, 
    businessValue: String,
    communityValue: String, 
    santeValue: String,
    itValue: String, 
    lifestyleValue: String, 
    partyValue: String,
    meetingValue: String,
    PublicValue: Boolean,
    WorkshopValue: String
  }

  objectFilterCount(filter) {

    let i = 0;

    filter.SportValue == true ? i++ : i = i;
    filter.ArtsValue == true ?  i++ : i = i;
    filter.cultureValue == true ? i++ : i = i;
    filter.MediaValue == true ?  i++ : i = i;
    filter.musicValue == true ? i++ : i = i;
    filter.socialValue == true ? i++ : i = i;
    filter.internValue == true ? i++ : i = i;
    filter.businessValue == true ?  i++ : i = i;
    filter.communityValue == true ? i++ : i = i;
    filter.santeValue == true ?  i++ : i = i;
    filter.itValue == true ?  i++ : i = i;
    filter.lifestyleValue == true ?  i++ : i = i;
    filter.partyValue == true ?  i++ : i = i;
    filter.meetingValue == true ? i++ : i = i;
    filter.WorkshopValue == true ?  i++ : i = i;
    filter.PublicValue == true ?  i++ : i = i;

    return i;
  }

  initFilterList(filterList, filter): Promise<{}>{

    filterList.SportValue = filter.SportValue;
    filterList.ArtsValue = filter.ArtsValue;
    filterList.cultureValue = filter.cultureValue;
    filterList.MediaValue = filter.MediaValue;
    filterList.musicValue = filter.musicValue;
    filterList.socialValue = filter.socialValue;
    filterList.internValue = filter.internValue;
    filterList.businessValue = filter.businessValue;
    filterList.communityValue = filter.communityValue;
    filterList.santeValue = filter.santeValue;
    filterList.itValue = filter.itValue;
    filterList.lifestyleValue = filter.lifestyleValue;
    filterList.partyValue = filter.partyValue;
    filterList.meetingValue = filter.meetingValue;
    filterList.WorkshopValue = filter.WorkshopValue;
    filterList.PublicValue = filter.PublicValue;

    return new Promise ((resolve, reject) => {
      resolve(filterList)
    })
  }


  initFilter(value) {
    return new Promise((resolve, reject) => {
      let filterlist = {
        SportValue: value,
        ArtsValue: value,
        cultureValue: value, 
        MediaValue: value,
        musicValue: value, 
        socialValue: value, 
        internValue: value, 
        businessValue: value,
        communityValue: value, 
        santeValue: value,
        itValue: value, 
        lifestyleValue: value, 
        partyValue: value,
        meetingValue: value,
        PublicValue: value,
        WorkshopValue: value
      }

      resolve(filterlist);
    })

  }

  changeFilterList(selectAllFilters) {
    return new Promise((resolve, reject) => {
      if (selectAllFilters == true) {
        this.initFilter(true)
        .then(data => resolve(data))
      } else  if (selectAllFilters == false) {
        this.initFilter(false)
        .then(data => resolve(data))
      }
    })
  }

}
