import { 
  Component 
} from '@angular/core';

import { 
  IonicPage,
   NavController, 
   ViewController,
   NavParams 
  } from 'ionic-angular';

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

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController, 
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventFilterPage');
  }

  closeFilterModal() {
      this.viewCtrl.dismiss();  
  }

  closeConfirmModal() {
    let filter = {
    SportValue: this.SportValue === undefined ? false : true,
    ArtsValue: this.ArtsValue === undefined ? false : true,
    cultureValue: this.cultureValue === undefined ? false : true, 
    MediaValue: this.MediaValue === undefined ? false : true,
    musicValue: this.musicValue === undefined ? false : true, 
    socialValue: this.socialValue === undefined ? false : true, 
    internValue: this.internValue === undefined ? false : true, 
    businessValue: this.businessValue === undefined ? false : true,
    communityValue: this.communityValue === undefined ? false : true, 
    santeValue: this.santeValue === undefined ? false : true,
    itValue: this.itValue === undefined ? false : true, 
    lifestyleValue: this.lifestyleValue === undefined ? false : true, 
    partyValue: this.partyValue === undefined ? false : true,
    meetingValue: this.meetingValue === undefined ? false : true,
    WorkshopValue: this.WorkshopValue === undefined ? false : true,
    }
    console.log("FILTER : ", filter);
    this.viewCtrl.dismiss(filter); 
}


}
