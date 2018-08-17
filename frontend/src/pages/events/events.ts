import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Item } from "ionic-angular";
import { Event } from "../../models/event.model";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import { CommunityProvider } from "../../providers/community/community";
import { EventProvider } from "../../providers/event/event";
import { User } from "../../models/user.model";
import { UserProvider } from "../../providers/user/user";
import { Community } from "../../models/community.model";

 
@IonicPage({ name: "EventsPage" })
@Component({
	selector: 'page-events',
	templateUrl: 'events.html'
})
export class EventsPage {
	public userObject;
	public user: User;
	public responseArray: any[];
	public currentEvents: string[];
	public communityObject;
	public eventsArray: any;

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams, 
		public http: Http, 
		public cp: CommunityProvider,
		public ep: EventProvider,
		public up: UserProvider
	) {
		this.userObject = {
			userId: this.navParams.get("userId"),
			token: this.navParams.get("token")
		};
		up.getUserById(<string>this.userObject.userId, <string>this.userObject.token)
		.subscribe((response) => {
			this.responseArray = response.json();
			this.user = this.responseArray.User[0];
			if (this.user.currentEvents) {
				this.userObject.eventsICreated = this.user.currentEvents.eventsICreated;
				this.userObject.eventsIParticipate = this.user.currentEvents.eventsIParticipate;
			}
			this.userObject.communityId = this.user.communities[0];
			this.user = undefined; // free memory of user: safer and speed the application

			console.log("Community_id: ", this.userObject);
			cp.getCommunityById(<string>this.userObject.communityId, <string>this.userObject.token)
			.subscribe((response) => {
				this.responseArray = response.json();
				this.communityObject = this.responseArray.community[0];
				this.currentEvents = this.communityObject.communityCurrentEvents;
				console.log("events in community: ", this.currentEvents);

				this.currentEvents.forEach((item, index) => {
					ep.getEventsById(<string>item, <string>this.userObject.token)
					.subscribe((response) => {
						console.log(response.json());
						//this.eventsArray.push(response);
					})
				})

			})
		},
		(error) => console.log(error)
		)
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad EventsPage');
	}
}