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

import {
	UtilsProvider
} from '../../providers/utils/utils';

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
		public utils: UtilsProvider,
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

	goToEventDetail(eventDetails) {
		this.nav.push("EventDetailsPage", {
			data: eventDetails,
			userId: this.tabParams.userId,
			token: this.tabParams.token,
			activeCommunity: this.tabParams.activeCommunity
		});
	}

	getAllEvents() {
		this.eventProvider.getFilteredAllEventsByCommunityId(this.tabParams)
			.subscribe(response => {
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

	updateEventlist() {
		let searchResults = this.allEvents_tmp;
		if (this.queryText == "") {
			this.allEvents = this.allEvents_tmp;
		}
		if (this.queryText.length > 0) {
			this.allEvents = [];
			searchResults.map(event => {
				this.utils.checkStringExist(event.eventDescription, this.queryText) == true ?
					this.allEvents.push(event) :
					this.utils.checkStringExist(event.eventName, this.queryText) == true ?
						this.allEvents.push(event) : 
						this.utils.checkStringExist(event.eventLocation, this.queryText) == true ?
						this.allEvents.push(event) : "";
			})
		}
	}

}	