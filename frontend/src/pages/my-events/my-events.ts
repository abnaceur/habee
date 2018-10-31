import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  public url = ENV.BASE_URL;
  public months: String[];

  constructor(public eventProvider: EventProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.tabParams = {
		  userId: this.navParams.get("userId"),
		  token: this.navParams.get("token"),
		  activeCommunity: this.navParams.get('activeCommunity')	
		};
  }

  ionViewWillEnter() {
    this.eventProvider.getUserInformation(this.tabParams.token, this.tabParams.userId)
		.subscribe(response => {
			this.userInfo = response.User[0].eventsParticipated,
			console.log("Repsonse this 333 : ", response.User[0].eventsParticipated)
		  });
      this.months = ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun", "Jui", "Aout", "Sep", "Oct", "Nov", "Dec"];
  }


  
  delete(item) {
    alert('Deleted ' + item.title);
  }

  viewComments(item) {
    alert('Viewing comments of ' + item.title);
  }

  viewPlayers(item) {
    alert('Viewing players of ' + item.title);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyEventsPage');
  }

}
