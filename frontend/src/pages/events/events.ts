import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Event } from "../../models/event.model";

@IonicPage({ name: "EventsPage"})
@Component({
	selector: 'page-events',
	templateUrl: 'events.html'
})
export class EventsPage {
	private allEvents: Event[];

	// This will be replaced by events retrieved from the server through http requests.
	// For now, we will use these hardcoded data
	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.allEvents = [new Event("../../assets/imgs/event1.jpg", "football match", "OM vs PSG. Allez l'OM!!!", "demain",
			10, "stade velodrome", "2h"), new Event("../../assets/imgs/event2.jpg", "yoga", "Relaxation et bien être", "12/11/2022",
			3, "sale de yoga", "45min")];
		console.log("Initialized allEvents");
		console.log(this.allEvents);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad EventsPage');
	}

}