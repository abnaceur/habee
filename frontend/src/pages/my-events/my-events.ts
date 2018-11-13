import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { EventProvider } from '../../providers/event/event';
import { environment as ENV } from '../../environments/environment';


/**
 * Generated class for the MyEventsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-events',
  templateUrl: 'my-events.html',
})
export class MyEventsPage {

  public tabParams;
  items1 = [
    {
      imageUrl: 'assets/img/lists/stadium.jpg',
      title: 'First Cup',
      place: 'Madison Square',
      date: '05/06/2016'
    },
    {
      imageUrl: 'assets/img/lists/stadium-3.png',
      title: 'Season',
      place: 'Hooli',
      date: '15/03/2016'
    },
    {
      imageUrl: 'assets/img/lists/stadium-2.jpg',
      title: '2nd Season',
      place: 'Castelão',
      date: '05/12/2015'
    },
  ];
  eventParticipated = [
    {
      name: 'Evenement participer',
    },
  ]

  eventPropose = [ {
    name: 'Evenement proposer'
  },]

  public userInfo;
  public proposedEvents;
  public url = ENV.BASE_URL;
  public months: String[];

  constructor(
    public nav: NavController, 
    private toastController: ToastController, 
    public eventProvider: EventProvider, 
    public navCtrl: NavController, 
    public navParams: NavParams) {
    
      this.tabParams = {
		  userId: this.navParams.get("userId"),
		  token: this.navParams.get("token"),
		  activeCommunity: this.navParams.get('activeCommunity')	
		};
  }

  ionViewWillEnter() {
    this.eventProvider.getUserInformation(this.tabParams.token, this.tabParams.userId)
		.subscribe(response => {
      console.log("this : ", response.User[0].eventsParticipated),
			this.userInfo = response.User[0].eventsParticipated
      });
      
    this.eventProvider.getAllProposedEvevnstByUser(this.tabParams)
    .subscribe(response => {
      this.proposedEvents = response.Events,
      console.log("this 1113232: ", response.Events[0])
      });

      this.months = ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun", "Jui", "Aout", "Sep", "Oct", "Nov", "Dec"];
  }


  
  unsubscrib(eventId) {
    this.eventProvider.getEventSubscription(eventId, this.tabParams.token, this.tabParams.userId, this.tabParams.activeCommunity)
    .subscribe(response => {
      if (response.Subscribe == true) {
        let subscribedToast = this.toastController.create({
          message: "Inscription reussie !",
          duration: 2000,
          position: 'top',
          cssClass: "subscribedClass"
        });
        // TODO ADD WHEN SUBSCRIBED
        this.eventProvider.getUserInformation(this.tabParams.token, this.tabParams.userId)
		.subscribe(response => {
			this.userInfo = response.User[0].eventsParticipated
		  });
        subscribedToast.present();
      } else if (response.Subscribe == false) {
        let subscribedToast = this.toastController.create({
          message: "Desinscription reussie !",
          duration: 2000,
          position: 'top',
          cssClass: "subscribedClass"
        });
        this.eventProvider.getUserInformation(this.tabParams.token, this.tabParams.userId)
		.subscribe(response => {
			this.userInfo = response.User[0].eventsParticipated
		  });
        subscribedToast.present();
      }
    });
  }


  viewEventDetails(eventDetails) {
    eventDetails.nbrSubscribedParticipants = eventDetails.participants.length,
    this.nav.push("EventDetailsPage", {
			data: eventDetails,
			userId: this.tabParams.userId,
			token: this.tabParams.token,
			activeCommunity: this.tabParams.activeCommunity
		  });
  }
}
