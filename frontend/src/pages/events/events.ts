import {
	Component
} from "@angular/core";

import {
	IonicPage,
	NavController,
	ModalController,
	NavParams, Item
} from "ionic-angular";

import {
	Event
} from "../../models/event.model";

import {
	Http
} from "@angular/http";

import "rxjs/add/operator/map";

import {
	CommunityProvider
} from "../../providers/community/community";

import {
	RetrieveEventsProvider
} from "../../providers/retrieve-events/retrieve-events";

import {
	User
} from "../../models/user.model";

import {
	Community
} from "../../models/community.model";

import {
	EventProvider
} from '../../providers/event/event';

import {
	environment as ENV
} from '../../environments/environment';



@IonicPage({ name: "EventsPage" })
@Component({
	selector: 'page-events',
	templateUrl: 'events.html'
})
export class EventsPage {
	items = {
		icon: 'pin',
	};

	public tabParams;
	public allEvents = [];
	public isSubscribed = "S'inscrir3";
	public months: String[];
	public url = ENV.BASE_URL;
	public queryText;
	public allEvents_tmp;

	constructor(
		public modalCtrl: ModalController,
		public eventProvider: EventProvider,
		public http: Http,
		public navCtrl: NavController,
		public navParams: NavParams,
		public nav: NavController) {

		this.tabParams = {
			userId: this.navParams.get("userId"),
			token: this.navParams.get("token"),
			activeCommunity: this.navParams.get('activeCommunity')
		};
	}

	ionViewWillEnter() {
		this.getAllEvents()
		this.months = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Jun", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];
	}

	async getAllevent() {
		this.eventProvider.getEventsByCommunityId(this.tabParams.token, this.tabParams.userId, this.tabParams.activeCommunity)
			.subscribe(response => {
				response.Events.length > 0 ?
					this.allEvents = response.Events : this.allEvents = [],
					console.log("Repsonse this 13 : ", response)
			});
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

	getAllEvents() {
		this.eventProvider.getFilteredAllEventsByCommunityId(this.tabParams)
			.subscribe(response => {
				console.log("Refresh : ", response);
				if (!response)
					this.allEvents = []
				else {
					this.allEvents = response.Events;
					this.allEvents_tmp = response.Events;
				}

			});
	}

	doRefresh(refresher) {
		this.getAllEvents();
		setTimeout(() => {
			console.log('Complete');
			refresher.complete()
		}, 2000);
	}

	subscribeToEvent(eventId) {
		alert("ss");
		console.log("Info 128 : ", this.tabParams.token, this.tabParams.userId, eventId)
		//this.eventProvider.getEventSubscription(eventId, this.tabParams.token, this.tabParams.userId, this.tabParams.activeCommunity);
	}

	formatTime(month, day) {
		let time = { subtitle: this.months[month], title: day }
		return time;
	}

	countElements(elem) {
		let i = 0;
		while (elem[i]) i++;
		return i;
	}


	presentFilter() {
		const modal = this.modalCtrl.create('EventFilterPage', this.tabParams);
		modal.onDidDismiss(filterData => {
			console.log("filterData :", filterData);
			this.eventProvider.checkFilterOptions(filterData)
				.then(activeFilters => {
					let countElem = this.countElements(activeFilters);
					if (countElem == 0) {
						this.getAllEvents();
					} else {
						this.eventProvider.getEventsByCommunityId(this.tabParams)
							.subscribe(response => {
								if (!response)
									this.allEvents = []
								else {
									this.allEvents = response.Events;
									this.eventProvider.eventApplyFilter(activeFilters, this.allEvents, countElem)
										.then(filteredEevents => {
											this.allEvents = Object.create(filteredEevents);
										})
								}
							});
					}
				});
		});
		modal.present();
	}

	checkStringExist(str, needle) {
		let i = 0;
		let a = 0;
		let t = 0;
		let z = needle.length;

		console.log(str, needle);
		while (str[i]) {
			t = i;
			while (str[t] == needle[a]) {
				console.log("Compare : ", str[t], z);
				z--;
				t++;
				a++;
				if (z == 0)
					return true;
			}

			a = 0;
			t = 0;
			z = needle.length;
			i++;
		}
		return false;
	}

	updateEventlist() {
		console.log("queryText :", this.queryText.length, this.queryText);
		let searchResults = this.allEvents_tmp;
		if (this.queryText == "") {
			console.log("Events: ", this.allEvents, this.allEvents_tmp)
			this.allEvents = this.allEvents_tmp;
		}
		if (this.queryText.length > 0) {
			this.allEvents = [];
			searchResults.map(event => {
				console.log("Single event :", event);
				//console.log(this.checkStringExist(event.eventCategory, this.queryText));
				this.checkStringExist(event.eventDescription, this.queryText) == true ?
					this.allEvents.push(event)
					: this.checkStringExist(event.eventName, this.queryText) == true ?
						this.allEvents.push(event) : "";
			})
		}
	}
}	