import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Event } from "../../models/event.model";

@IonicPage({ name: "EventsPage" })
@Component({
	selector: 'page-events',
	templateUrl: 'events.html'
})
export class EventsPage {
	private allEvents: Event[];

	// to test the edit/delete event feature only
	private userId = "Abdel";

	// This will be replaced by events retrieved from the server through http requests.
	// For now, we will use these hardcoded data
	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.allEvents = [new Event("../../assets/imgs/event1.jpg", "Football Match", "OM vs PSG. Allez l'OM!!! On amène les feux d'artifices, on va avec les ultras!!!!!", "Jeudi 07 Septembre 2019",
			10, "stade velodrome", "2h", "Abdel"), new Event("../../assets/imgs/event2.jpg", "Yoga", "Relaxation et bien être", "Lundi 12 Octobre 2022",
				3, "sale de yoga", "45min", "Jean")];
		console.log("Initialized allEvents");
		console.log(this.allEvents);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad EventsPage');
	}

}