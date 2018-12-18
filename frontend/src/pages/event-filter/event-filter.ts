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
  public SportValue;
  public ArtsValue;
  public cultureValue;
  public MediaValue;
  public musicValue;
  public socialValue;
  public internValue;
  public businessValue;
  public communityValue;
  public santeValue;
  public itValue;
  public lifestyleValue;
  public partyValue;
  public meetingValue;
  public WorkshopValue;

  public tabParams;

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController, 
    public eventProvider: EventProvider,
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
      let filter = filters.filterEvent[0];
      this.SportValue = filter.SportValue;
      this.ArtsValue = filter.ArtsValue;
      this.cultureValue = filter.cultureValue;
      this.MediaValue = filter.MediaValue ;
      this.musicValue = filter.musicValue;
      this.socialValue = filter.socialValue;
      this.internValue = filter.internValue;
      this.businessValue = filter.businessValue;
      this.communityValue = filter.communityValue;
      this.santeValue = filter.santeValue;
      this.itValue = filter.itValue;
      this.lifestyleValue = filter.lifestyleValue;
      this.partyValue = filter.partyValue;
      this.meetingValue = filter.meetingValue;
      this.WorkshopValue = filter.WorkshopValue;
    })
  }


  closeFilterModal() {
    let filter = {
      SportValue: this.SportValue,
      ArtsValue: this.ArtsValue,
      cultureValue: this.cultureValue, 
      MediaValue: this.MediaValue,
      musicValue: this.musicValue, 
      socialValue: this.socialValue, 
      internValue: this.internValue, 
      businessValue: this.businessValue,
      communityValue: this.communityValue, 
      santeValue: this.santeValue,
      itValue: this.itValue, 
      lifestyleValue: this.lifestyleValue, 
      partyValue: this.partyValue,
      meetingValue: this.meetingValue,
      WorkshopValue: this.WorkshopValue,
      }

      this.viewCtrl.dismiss(filter);  
  }

  closeConfirmModal() {
    let filter = {
    SportValue: this.SportValue,
    ArtsValue: this.ArtsValue,
    cultureValue: this.cultureValue, 
    MediaValue: this.MediaValue,
    musicValue: this.musicValue, 
    socialValue: this.socialValue, 
    internValue: this.internValue, 
    businessValue: this.businessValue,
    communityValue: this.communityValue, 
    santeValue: this.santeValue,
    itValue: this.itValue, 
    lifestyleValue: this.lifestyleValue, 
    partyValue: this.partyValue,
    meetingValue: this.meetingValue,
    WorkshopValue: this.WorkshopValue,
    }

    this.eventProvider.saveFilterOptions(filter, this.tabParams)
    .subscribe(filters => {
      console.log("FILTER RESPONSE : ", filters);   
    });
    console.log("FILTER : ", filter);
    this.viewCtrl.dismiss(filter); 
}


}
