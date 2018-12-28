import {
  Component
} from '@angular/core';

import {
  IonicPage,
  NavController,
  ViewController,
  NavParams
} from 'ionic-angular';

import {
  EventProvider
} from '../../providers/event/event';

import {
  EventFilterProvider
} from '../../providers/event-filter/event-filter';


/**
 * Generated class for the EventFilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-filter',
  templateUrl: 'event-filter.html',
})
export class EventFilterPage {
  public filterList = {
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
    WorkshopValue: String,
  }

  public tabParams;

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public eventProvider: EventProvider,
    public eventFilterProvider: EventFilterProvider,
    public navParams: NavParams) {

    this.tabParams = {
      userId: this.navParams.get("userId"),
      token: this.navParams.get("token"),
      activeCommunity: this.navParams.get('activeCommunity')
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventFilterPage', this.navParams);
    this.eventProvider.getFilterOptions(this.tabParams)
      .subscribe(filters => {
        let filter = filters.filterEvent;
        this.eventFilterProvider.initFilterList(this.filterList, filter)
          .then(filterList => {
            this.filterList = filterList
          })
      })
  }


  closeFilterModal() {
    this.viewCtrl.dismiss(this.filterList);
  }

  closeConfirmModal() {
    
    this.eventProvider.saveFilterOptions(this.filterList, this.tabParams)
      .subscribe(filters => {
        console.log("FILTER RESPONSE : ", filters);
      });
    console.log("FILTER : ", this.filterList);
    this.viewCtrl.dismiss(this.filterList);
  }


}
