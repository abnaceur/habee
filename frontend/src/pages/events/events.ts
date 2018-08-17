import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Item } from "ionic-angular";
import { Event } from "../../models/event.model";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import { CommunityProvider } from "../../providers/community/community";
import { RetrieveEventsProvider } from "../../providers/retrieve-events/retrieve-events";
import { User } from "../../models/user.model";
import { Community } from "../../models/community.model";

 
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

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams, 
		public http: Http, 
		public cp: CommunityProvider,
		public rep: RetrieveEventsProvider
	) {
		this.userObject = {
			userId: this.navParams.get("userId"),
			token: this.navParams.get("token")
		};

		rep.getUserById(<string>this.userObject.userId)
		.subscribe((response) => {
			this.userArray = response.json();
			this.user = this.userArray.User[0];
			if (this.user.currentEvents) {
				this.userObject.eventsICreated = this.user.currentEvents.eventsICreated;
				this.userObject.eventsIParticipate = this.user.currentEvents.eventsIParticipate;
			}
			this.userObject.communityId = this.user.communities[0];
			this.user = undefined; // free memory of user: safer and speed the application

			//cp.getCommunityById(<string>this.userObject.communityId)
			//.subscribe((response) => {
			//	console.log("COMMUNITYID GET: ", response);
			//})
		},
		(error) => console.log(error)
		)
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad EventsPage');
	}
}