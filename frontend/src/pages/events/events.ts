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
	public eventTitle;
	public eventImage;
	public eventCreatedBy;
	public eventDate;

	constructor(public eventProvider: EventProvider, public http: Http, public navCtrl: NavController, public navParams: NavParams, public nav: NavController) {
		this.tabParams = {
		  userId: this.navParams.get("userId"),
		  token: this.navParams.get("token"),
		  activeCommunity: this.navParams.get('activeCommunity')
		};
	  }
	
	ionViewDidLoad() {
		console.log('ionViewDidLoad EventsPage');
		this.eventProvider.getEventsByCommunityId(this.tabParams.token, this.tabParams.userId, this.tabParams.activeCommunity)
		.subscribe(response => {
			console.log("Repsonse this 13 : ", response),
			this.eventTitle = response.Events[0]['eventName'],
			this.eventImage = ENV.BASE_URL + '/' + response.Events[0]['eventPhoto'], 
			this.eventCreatedBy = response.Events[0]['eventCreator'],
			this.eventDate = response.Events[0]['eventDate'].substring(0, response.Events[0]['eventDate'].search('T'))
		  });

	}

	
}