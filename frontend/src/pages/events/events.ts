import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Event } from "../../models/event.model";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";

 
@IonicPage({ name: "EventsPage" })
@Component({
	selector: 'page-events',
	templateUrl: 'events.html'
})
export class EventsPage {
	private allEvents: Event[];

	constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
		console.log("Initialized allEvents");
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad EventsPage');
	}

}