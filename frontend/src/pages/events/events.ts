import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Item } from "ionic-angular";
import { Event } from "../../models/event.model";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import { CommunityProvider } from "../../providers/community/community";
import { RetrieveEventsProvider } from "../../providers/retrieve-events/retrieve-events";
import { User } from "../../models/user.model";
import { Community } from "../../models/community.model";
import { EventProvider } from '../../providers/event/event';
import { environment as ENV } from '../../environments/environment';

 
@IonicPage({ name: "EventsPage" })
@Component({
	selector: 'page-events',
	templateUrl: 'events.html'
})
export class EventsPage {
	public tabParams;
	public allEvents;
	public isSubscribed = "S'inscrir3";
	public months: String[];

	constructor(public eventProvider: EventProvider, public http: Http, public navCtrl: NavController, public navParams: NavParams, public nav: NavController) {
		this.tabParams = {
		  userId: this.navParams.get("userId"),
		  token: this.navParams.get("token"),
		  activeCommunity: this.navParams.get('activeCommunity')	
		};
	 }
	
	 ionViewWillEnter() {
		console.log('ionViewDidLoad EventsPage', this.tabParams);
		this.eventProvider.getEventsByCommunityId(this.tabParams.token, this.tabParams.userId, this.tabParams.activeCommunity)
		.subscribe(response => {
			this.allEvents = response.Events,
			console.log("Repsonse this 13 : ", response)
		  });
		  this.months = ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun", "Jui", "Aout", "Sep", "Oct", "Nov", "Dec"];
	
	}


	goToEventDetail(eventDetails) {
		this.nav.push("EventDetailsPage", {
			data: eventDetails,
			userId: this.tabParams.userId,
			token: this.tabParams.token,
			activeCommunity: this.tabParams.activeCommunity
		  });
		console.log("test event")
	}

	subscribeToEvent(eventId) {
		alert("ss");
		console.log("Info 128 : ", this.tabParams.token, this.tabParams.userId, eventId)
		//this.eventProvider.getEventSubscription(eventId, this.tabParams.token, this.tabParams.userId, this.tabParams.activeCommunity);
	  }
}