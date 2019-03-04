import { Component } from "@angular/core";

import {
  IonicPage,
  NavController,
  ModalController,
  MenuController,
  NavParams,
  Platform,
  Item
} from "ionic-angular";

import { EventFilterProvider } from "../../providers/event-filter/event-filter";

import { Http } from "@angular/http";

import "rxjs/add/operator/map";

import { CommunityProvider } from "../../providers/community/community";

import { RetrieveEventsProvider } from "../../providers/retrieve-events/retrieve-events";

import { User } from "../../models/user.model";

import { Community } from "../../models/community.model";

import { EventProvider } from "../../providers/event/event";

import { environment as ENV } from "../../environments/environment";

import { Socket } from "ng-socket-io";

import { LocalNotifications } from "@ionic-native/local-notifications";

import { UtilsProvider } from "../../providers/utils/utils";

@IonicPage({ name: "EventsPage" })
@Component({
  selector: "page-events",
  templateUrl: "events.html"
})
export class EventsPage {
  items = {
    icon: "pin"
  };

  private tabParams;
  public allEvents = [];
  public isSubscribed = "S'inscrir3";
  public months: String[];
  public url = ENV.BASE_URL;
  public queryText;
  public allEvents_tmp;
  public searchBar = "none";
  public activeAllFilters;
  communityInfo = {
    communityLogo: String,
    communityName: String
  };

  constructor(
    public platform: Platform,
    public localNotifications: LocalNotifications,
    private communityProvider: CommunityProvider,
    private eventFilterProvider: EventFilterProvider,
    public modalCtrl: ModalController,
    private eventProvider: EventProvider,
    public http: Http,
    public navCtrl: NavController,
    public navParams: NavParams,
    private utils: UtilsProvider,
    public menu: MenuController,
    public nav: NavController
  ) {
    this.menu.enable(true, "left");
    this.tabParams = {
      userId: this.navParams.get("userId"),
      token: this.navParams.get("token"),
      activeCommunity: this.navParams.get("activeCommunity"),
      notificationStatus: this.navParams.get("notificationStatus")
    };
  }

  ionViewWillLoad() {
    this.getCommunityImage();
  }
  
  ionViewWillEnter() {
    this.getAllEvents();
    this.countActiveFilters();
    this.getCommunityImage();
    this.months = [
      "Janvier",
      "Fevrier",
      "Mars",
      "Avril",
      "Mai",
      "Jun",
      "Juillet",
      "Aout",
      "Septembre",
      "Octobre",
      "Novembre",
      "Decembre"
    ];
  }

  getCommunityImage() {
    if (this.tabParams.activeCommunity != "") {
      this.communityProvider
        .getCommunityById(this.tabParams)
        .subscribe(comInfo => {
          (this.communityInfo.communityLogo = comInfo.communityLogo),
            (this.communityInfo.communityName = comInfo.communityName);
        });
    }
  }

  goToEventDetail(eventDetails) {
    this.nav.push("EventDetailsPage", {
      data: eventDetails,
      userId: this.tabParams.userId,
      token: this.tabParams.token,
      activeCommunity: this.tabParams.activeCommunity
    });
  }

  countActiveFilters() {
    this.eventProvider
      .getFilterOptions(this.tabParams)
      .subscribe(allFilters => {
        this.activeAllFilters = this.eventFilterProvider.objectFilterCount(
          allFilters.filterEvent
        );
      });
  }

  getAllEvents() {
    this.eventProvider
      .getFilteredAllEventsByCommunityId(this.tabParams)
      .subscribe(response => {
        if (!response) this.allEvents = [];
        else {
          this.allEvents = response.Events;
          this.allEvents_tmp = response.Events;
        }
      });
  }

  doRefresh(refresher) {
    this.getAllEvents();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  subscribeToEvent(eventId) {
    alert("ss");
    console.log(
      "Info 128 : ",
      this.tabParams.token,
      this.tabParams.userId,
      eventId
    );
    //this.eventProvider.getEventSubscription(eventId, this.tabParams.token, this.tabParams.userId, this.tabParams.activeCommunity);
  }

  formatTime(month, day) {
    let time = { subtitle: this.months[month], title: day };
    return time;
  }

  countElements(elem) {
    let i = 0;
    while (elem[i]) i++;
    return i;
  }

  presentFilter() {
    const modal = this.modalCtrl.create("EventFilterPage", this.tabParams);
    modal.onDidDismiss(filterData => {
      this.countActiveFilters();
      this.eventProvider.checkFilterOptions(filterData).then(activeFilters => {
        let countElem = this.countElements(activeFilters);
        if (countElem == 0) {
          this.getAllEvents();
        } else {
          this.eventProvider
            .getEventsByCommunityId(this.tabParams)
            .subscribe(response => {
              if (!response) this.allEvents = [];
              else {
                this.allEvents = response.Events;
                this.eventProvider
                  .eventApplyFilter(activeFilters, this.allEvents, countElem)
                  .then(filteredEevents => {
                    this.allEvents = Object.create(filteredEevents);
                  });
              }
            });
        }
      });
    });
    modal.present();
  }

  showsearchbar() {
    if (this.searchBar === "none") this.searchBar = "initial";
    else if (this.searchBar === "initial") this.searchBar = "none";
  }

  updateEventlist() {
    let searchResults = this.allEvents_tmp;
    if (this.queryText == "") {
      this.allEvents = this.allEvents_tmp;
    }
    if (this.queryText.length > 0) {
      this.allEvents = [];
      searchResults.map(event => {
        this.utils.checkStringExist(event.eventDescription, this.queryText) ==
        true
          ? this.allEvents.push(event)
          : this.utils.checkStringExist(event.eventName, this.queryText) == true
          ? this.allEvents.push(event)
          : this.utils.checkStringExist(event.eventLocation, this.queryText) ==
            true
          ? this.allEvents.push(event)
          : "";
      });
    }
  }
}
