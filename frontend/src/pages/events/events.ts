import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Item } from "ionic-angular";
import { Event } from "../../models/event.model";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import { RetrieveEventsProvider } from "../../providers/retrieve-events/retrieve-events";
import { User } from "../../models/user.model";

 
@IonicPage({ name: "EventsPage" })
@Component({
	selector: 'page-events',
	templateUrl: 'events.html'
})
export class EventsPage {
	public userObject;
	public user: User;
	public userArray: any[];
	public currentEvents: string[];

	constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public rep: RetrieveEventsProvider) {
		console.log("Initialized allEvents");
		this.userObject = {
			userId: this.navParams.get("userId"),
			token: this.navParams.get("token")
		};
		console.log("user in Events: ", this.userObject);
		rep.getUserById(<string>this.userObject.userId)
		.subscribe((response) => {
			this.userArray = response.json();
			this.user = this.userArray.User[0];
			console.log("in event, did retrieve user: ", this.user);
			if (this.user.currentEvents) {
				console.log("EVENTS: user.currentEvents exist");
				this.currentEvents = this.user.currentEvents.eventsICreated.concat(this.user.currentEvents.eventsIParticipate);
				// remove duplicates from array
				this.currentEvents = Array.from(new Set(this.currentEvents));
				console.log("CURRENT EVENTS: ", this.currentEvents);
			}
		},
		(error) => console.log(error)
		)
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad EventsPage');
	}
}