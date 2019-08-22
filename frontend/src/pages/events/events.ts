import { Component, ViewChild } from "@angular/core";

import {
  Slides,
  IonicPage,
  NavController,
  ModalController,
  MenuController,
  NavParams,
  Platform,
  LoadingController,
  Events,
  Item
} from "ionic-angular";

import moment from "moment";

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
import { ThrowStmt } from "@angular/compiler";

@IonicPage({ name: "EventsPage" })
@Component({
  selector: "page-events",
  templateUrl: "events.html"
})
export class EventsPage {
  @ViewChild("slider") slider: Slides;
  items = {
    icon: "pin"
  };

  page = 0;
  perPage = 0;
  totalData = 0;
  totalPage = 0;

  pageSearch = 0;
  perPageSearch = 0;
  totalDataSearch = 0;
  totalPageSearch = 0;

  public dateFormat;
  public listMonths: any[];

  private tabParams;
  public allEvents = [];
  public isSubscribed = "S'inscrir3";
  public months: String[];
  public url = ENV.BASE_URL;
  public queryText = "";
  public allEvents_tmp;
  public searchBar = "none";
  public topList = "5vw";
  public activeAllFilters;

  public allEvBorderDisplay = "initial";
  public weeklyEvBorderDisplay = "none";

  public allEvBorder = "5px solid darkgrey";
  public weeklyEvBorder = "";

  public weeklyEvents = [];

  constructor(
    public events: Events,
    private loadingCTRL: LoadingController,
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

    moment.locale("fr");
    this.dateFormat = moment;

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
    this.getAllEvents();
  }

  ionViewWillEnter() {
    let loader = this.loadingCTRL.create({
      spinner: 'dots',
    });
    loader.present();
    this.countActiveFilters();
    this.getAllEvents();
    loader.dismiss();
  }

  ionViewWillLeave() {
    this.page = 0;
    this.pageSearch = 0;
    this.queryText = "";
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

  getMonthsDelimiter(events) {
    let tmp = [];
    let i = 1;

    if (events.length > 1) {
      while (i < events.length - 1) {
        if (
          events[i - 1].eventStartDate.toString().substring(5, 7) ==
          events[i].eventStartDate.toString().substring(5, 7) &&
          events[i - 1].eventStartDate.toString().substring(0, 4) ==
          events[i].eventStartDate.toString().substring(0, 4)
        ) {
          tmp[i] = false;
        } else if (
          events[i - 1].eventStartDate.toString().substring(5, 7) !=
          events[i].eventStartDate.toString().substring(5, 7) &&
          events[i - 1].eventStartDate.toString().substring(0, 4) <
          events[i].eventStartDate.toString().substring(0, 4)
        ) {
          tmp[i] = events[i].eventStartDate;
        } else if (
          events[i - 1].eventStartDate.toString().substring(5, 7) !=
          events[i].eventStartDate.toString().substring(5, 7)
        ) {
          tmp[i] = events[i].eventStartDate;
        }
        i++;
      }
  
      if (
        events[events.length - 2].eventStartDate.toString().substring(5, 7) !=
        events[events.length - 1].eventStartDate.toString().substring(5, 7)
      ) {
        tmp[i] = events[events.length - 1].eventStartDate;
      } else
        tmp[i] = false;
    } else {
      tmp[0] = false;
    }
    
    this.listMonths = tmp;
  }

  getAllEvents() {
    this.eventProvider
      .getFilteredAllEventsByCommunityId(this.tabParams, this.page)
      .subscribe(response => {
        if (response.events != undefined && response.events.length == 0) {
          this.allEvents = [];
        } else {
          console.log("response.events ", response.events);
          if (response.events.length > 0)
            this.getMonthsDelimiter(response.events);
          this.allEvents = response.events;
          this.allEvents_tmp = response.events;
          this.perPage = response.per_page;
          this.totalData = response.total;
          this.totalPage = response.total_pages;
        }
      });
  }

  doRefresh(refresher) {
    this.page = 0;
    this.pageSearch = 0;
    this.getAllEvents();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  formatTime(month, day) {
    let time = { subtitle: this.months[month], title: day };
    return time;
  }

  doInfinite(infiniteScroll) {
    this.page = this.page + 1;

    setTimeout(() => {
      this.eventProvider
        .getFilteredAllEventsByCommunityId(this.tabParams, this.page)
        .subscribe(response => {
          if (!response) this.allEvents = [];
          else {
            this.allEvents = this.allEvents.concat(response.events);
            if (this.allEvBorder.length > 0)
              this.getMonthsDelimiter(this.allEvents);
            this.allEvents_tmp = this.allEvents_tmp.concat(response.events);
            this.perPage = response.per_page;
            this.totalData = response.total;
            this.totalPage = response.total_pages;
          }
        });
      infiniteScroll.complete();
    }, 1000);
  }

  doInfiniteSearch(infiniteScroll) {
    this.pageSearch = this.pageSearch + 1;

    setTimeout(() => {
      this.eventProvider.searchEventByInput(this.queryText, this.tabParams, this.pageSearch)
        .subscribe(data => {
          if (data.code === 200) {
            this.allEvents = this.allEvents.concat(data.events);
            if (this.allEvents.length > 0)
              this.getMonthsDelimiter(this.allEvents);
            this.perPageSearch = data.per_page;
            this.totalDataSearch = data.total;
            this.totalPageSearch = data.total_pages;
          }
        })
      infiniteScroll.complete();
    }, 1000);

  }

  presentFilter() {
    const modal = this.modalCtrl.create("EventFilterPage", this.tabParams);
    modal.onDidDismiss(filterData => {
      this.countActiveFilters();
      this.eventProvider.checkFilterOptions(filterData.filters).then(activeFilters => {
        this.getAllEvents();
        this.page = 0;
      });
    });
    modal.present();
  }

  showsearchbar() {
    if (this.searchBar === "none") {
      this.topList = "15vw";
      this.searchBar = "initial";
    } else if (this.searchBar === "initial") {
      this.searchBar = "none";
      this.topList = "5vw";
    }
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

  updateEventlistRequest() {
    this.pageSearch = 0;

    this.eventProvider.searchEventByInput(this.queryText, this.tabParams, this.pageSearch)
      .subscribe(data => {
        if (data.code === 200) {
          this.allEvents = data.events;
          if (this.allEvents.length > 0)
            this.getMonthsDelimiter(this.allEvents);
          this.perPageSearch = data.per_page;
          this.totalDataSearch = data.total;
          this.totalPageSearch = data.total_pages;
        }
      })
  }

  showAllCommunities() {
    const modal = this.modalCtrl.create(
      "CommunityEventListPage",
      this.tabParams,
      { cssClass: "comEvent-modal" }
    );
    modal.onDidDismiss(comId => {
      if (comId != "all" && comId != null) {
        this.communityProvider
          .updateSelectedCommunity(comId, this.tabParams)
          .subscribe(data => {
            if (data === 1) {
              this.tabParams.activeCommunity = comId;
              this.events.publish("user:info", this.tabParams);
              let menuData = ["Acceuil", this.tabParams];
              this.navCtrl.push("TabsPage", menuData);
            }
          });
      } else if (comId === "all") {
      }
    });
    modal.present();
  }

  selectWeeklyEvent() {
    this.getThisWeekEvent();
    this.allEvBorderDisplay = "none";
    this.weeklyEvBorderDisplay = "initial";
    this.allEvBorder = "";
    this.weeklyEvBorder = "5px solid darkgrey";
  }

  getThisWeekEvent() {
    //TODO GET WEEKLY EVENT FROM SERVER
    // let datNow = moment().format("YYYY-MM-DD");

    let i = 0;
    this.weeklyEvents = [];
    let weekdays = moment()
      .add(1, "week")
      .format("YYYY-MM-DD");

    while (i < this.allEvents.length) {
      if (this.allEvents[i].eventStartDate.substring(0, 10) <= weekdays) {
        this.weeklyEvents.push(this.allEvents[i]);
      }
      i++;
    }
  }

  selectAllEvent() {
    this.allEvBorderDisplay = "initial";
    this.weeklyEvBorderDisplay = "none";
    this.allEvBorder = "5px solid darkgrey";
    this.weeklyEvBorder = "";
  }
}
