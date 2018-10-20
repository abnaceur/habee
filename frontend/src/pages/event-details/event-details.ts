import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { environment as ENV } from '../../environments/environment';

/**
 * Generated class for the EventDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-details',
  templateUrl: 'event-details.html',
})
export class EventDetailsPage {
  public userName;
  public tabParams;
  public subPassions;
  public url = ENV.BASE_URL;
  eventDetails: {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.eventDetails = navParams.get('data');
    this.tabParams = {
      userId: this.navParams.get("userId"),
      token: this.navParams.get("token"),
      activeCommunity: this.navParams.get('activeCommunity')
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventDetailsPage', this.eventDetails);
  }

  subscribeToEvent(eventId) {
    console.log("Info 128 : ", this.tabParams.token, this.tabParams.userId, eventId)
  }

}
