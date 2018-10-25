import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { environment as ENV } from '../../environments/environment';
import { EventProvider } from '../../providers/event/event';

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
  public months: String[];
  public isSubscribed = "S'inscrir";

  constructor(private toastController: ToastController, public eventProvider: EventProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.eventDetails = navParams.get('data');
    this.tabParams = {
      userId: this.navParams.get("userId"),
      token: this.navParams.get("token"),
      activeCommunity: this.navParams.get('activeCommunity')
    };
   
    this.eventDetails.participants.map(pr => {
      if (pr !+ null) {
        if (pr.participantId == this.tabParams.userId)
          this.isSubscribed = "Desinscrir";
      }
    })
    this.months = ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun", "Jui", "Aout", "Sep", "Oct", "Nov", "Dec"]; 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventDetailsPage', this.eventDetails, this.tabParams);
  }


  subscribeToEvent(eventId) {
    console.log("Info 128 : ", this.tabParams.token, this.tabParams.userId, eventId)
    this.eventProvider.getEventSubscription(eventId, this.tabParams.token, this.tabParams.userId, this.tabParams.activeCommunity)
    .subscribe(response => {
      console.log("Repsonse this 13 : ", response.Subscribe)
      if (response.Subscribe == true) {
        let subscribedToast = this.toastController.create({
          message: "Inscription reussie !",
          duration: 2000,
          position: 'bottomn',
          cssClass: "subscribedClass"
        });
        this.isSubscribed = "Desinscrir";
        subscribedToast.present();
      } else if (response.Subscribe == false) {
        let subscribedToast = this.toastController.create({
          message: "Desinscription reussie !",
          duration: 2000,
          position: 'bottomn',
          cssClass: "subscribedClass"
        });
        this.isSubscribed = "S'inscrir";
        subscribedToast.present();
      }
		  });
  }

}
