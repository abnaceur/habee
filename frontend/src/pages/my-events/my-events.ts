import { Component, ViewChild } from "@angular/core";

import {
  Slides,
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  LoadingController,
  ModalController
} from "ionic-angular";

import moment from "moment";

import { UtilsProvider } from "../../providers/utils/utils";

import { EventProvider } from "../../providers/event/event";

import { environment as ENV } from "../../environments/environment";

/**
 * Generated class for the MyEventsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-my-events",
  templateUrl: "my-events.html"
})
export class MyEventsPage {
  @ViewChild("slider") slider: Slides;
  public tabParams;
  public participEvBorder = "5px solid darkgrey";
  public participEvBorderDisplay = "initial"
  public orgnizeEvBorder = "";
  public topList = "5vw";
  public orgnizeEvBorderDisplay = "none"

  public months: String[];
  eventParticipated = [
    {
      name: "Événement participé"
    }
  ];

  eventPropose = [
    {
      name: "Événement proposé"
    }
  ];

  page = 0;
  perPage = 0;
  totalData = 0;
  totalPage = 0;

  public dateFormat;
  public listMonths: any[];
  public listMonthsUser: any[];
  public userInfo;
  public proposedEvents;
  public url = ENV.BASE_URL;


  // Moadal declaration
  expanded: any;
  contracted: any;
  showIcon = true;
  preload = true;

  constructor(
    public nav: NavController,
    private loadingCTRL: LoadingController,
    public modalCtrl: ModalController,
    private toastController: ToastController,
    public eventProvider: EventProvider,
    public navCtrl: NavController,
    public utils: UtilsProvider,
    public navParams: NavParams
  ) {
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
  }

  formatTime(month, day) {
    let time = { subtitle: this.months[month], title: day };
    return time;
  }

  updateProposedEventList() {
    this.eventProvider
      .getAllProposedEvevnstByUser(this.tabParams, this.page)
      .subscribe(response => {
        if (response.Events != undefined)
          this.getMonthsDelimiter(response.Events, 0);
        this.proposedEvents = response.Events;
        this.perPage = response.per_page;
        this.totalData = response.total;
        this.totalPage = response.total_pages;
      });
  }

  ionViewWillLeave() {
    this.page = 0;
  }


  updatePrticipatedEventList() {
    this.eventProvider
      .getUserInformation(this.tabParams)
      .subscribe(response => {
        if (response.User != undefined)
          this.getMonthsDelimiter(response.User, 1);
        this.userInfo = response.User;
      });
  }


  getMonthsDelimiter(events, check) {
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

    check == 1 ? this.listMonthsUser = tmp
      : this.listMonths = tmp;
  }

  ionViewWillEnter() {
    let loader = this.loadingCTRL.create({
      spinner: 'dots',
    });
    loader.present();
    this.updatePrticipatedEventList();
    this.updateProposedEventList();
    loader.dismiss();
  }

  unsubscrib(eventId) {
    this.eventProvider
      .getEventSubscription(eventId, this.tabParams)
      .subscribe(response => {
        if (response.Subscribe == true) {
          this.updatePrticipatedEventList();
          this.updateProposedEventList();
          this.utils.notification("Inscription reussie !", "top");
        } else if (response.Subscribe == false) {
          this.updatePrticipatedEventList();
          this.updateProposedEventList();
          this.utils.notification("Desinscription reussie !", "top");
        }
      });
  }

  viewEventDetails(eventDetails) {
    (eventDetails.nbrSubscribedParticipants = eventDetails.participants.length),
      this.nav.push("EventDetailsPage", {
        data: eventDetails,
        userId: this.tabParams.userId,
        token: this.tabParams.token,
        activeCommunity: this.tabParams.activeCommunity
      });
  }

  deleteEventResponse(response) {
    if (response.message == "success") {
      this.eventProvider
        .getAllProposedEvevnstByUser(this.tabParams, this.page)
        .subscribe(response => {
          if (response.message == "There are no events!") {
            this.proposedEvents = [];
            this.updatePrticipatedEventList();
          } else {
            this.proposedEvents = response.Events;
            this.updatePrticipatedEventList();
          }
        });
      this.utils.notification("Event Supprimer avec succes", "top");
    } else {
      this.utils.notification("Une erreur est survenu !", "top");
    }
  }

  deleteEvent(event) {
    this.eventProvider
      .deleteTheiEvent(event, this.tabParams)
      .subscribe(response => {
        this.deleteEventResponse(response);
      });
  }

  expandPopModal(popPage, navInfo) {
    setTimeout(() => {
      const modal = this.modalCtrl.create(popPage, navInfo);
      modal.onDidDismiss(data => {
        this.updatePrticipatedEventList();
        this.updateProposedEventList();
        this.expanded = false;
        this.page = 0;
        this.contracted = !this.expanded;
        setTimeout(() => (this.showIcon = true), 330);
      });
      modal.onDidDismiss(data => {
        this.updateProposedEventList();
        this.selectOrgnizeEvent();
      })
      modal.present();
    }, 200);
  }

  expand(event) {
    this.expanded = true;
    this.contracted = !this.expanded;
    this.showIcon = false;

    let navInfo = {
      userInfo: this.tabParams,
      event: event
    };

    if (event === "this") this.expandPopModal("ProposeEventPage", navInfo);
    else this.expandPopModal("PopupEditModalPage", navInfo);
  }


  selectParticipEvent() {
    this.participEvBorderDisplay = "initial"
    this.orgnizeEvBorderDisplay = "none"
    this.orgnizeEvBorder = "";
    this.participEvBorder = "5px solid darkgrey";
  }

  selectOrgnizeEvent() {
    this.participEvBorderDisplay = "none"
    this.orgnizeEvBorderDisplay = "initial"
    this.participEvBorder = "";
    this.orgnizeEvBorder = "5px solid darkgrey";
  }

  doInfinite(infiniteScroll) {
    this.page = this.page + 1;

    console.log("Refresh")
    setTimeout(() => {
      this.eventProvider
        .getAllProposedEvevnstByUser(this.tabParams, this.page)
        .subscribe(response => {
          if (response.code != 404) {
            this.proposedEvents = this.proposedEvents.concat(response.Events);
            if (response.Events != undefined)
              this.getMonthsDelimiter(this.proposedEvents, 0)
            this.perPage = response.per_page;
            this.totalData = response.total;
            this.totalPage = response.total_pages;
          }
        });
      console.log("Async operation has ended");
      infiniteScroll.complete();
    }, 1000);
  }
}
