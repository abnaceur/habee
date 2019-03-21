import { Component, ViewChild } from "@angular/core";

import {
  Slides,
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  ModalController
} from "ionic-angular";

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
  public participEvBorder = "4px solid silver";
  public participEvBorderDisplay = "initial"
  public orgnizeEvBorder = "";
  public orgnizeEvBorderDisplay = "none"
 
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

  public userInfo;
  public proposedEvents;
  public url = ENV.BASE_URL;
  public months = [
    "Jan",
    "Fev",
    "Mar",
    "Avr",
    "Mai",
    "Jun",
    "Jui",
    "Aout",
    "Sep",
    "Oct",  
    "Nov",
    "Dec"
  ];

  // Moadal declaration
  expanded: any;
  contracted: any;
  showIcon = true;
  preload = true;

  constructor(
    public nav: NavController,
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
  }

  updateProposedEventList() {
    this.eventProvider
      .getAllProposedEvevnstByUser(this.tabParams)
      .subscribe(response => {
        this.proposedEvents = response.Events;
      });
  }

  updatePrticipatedEventList() {
    this.eventProvider
      .getUserInformation(this.tabParams)
      .subscribe(response => {
        this.userInfo = response.User;
      });
  }

  ionViewWillEnter() {
    this.updatePrticipatedEventList();
    this.updateProposedEventList();
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
        .getAllProposedEvevnstByUser(this.tabParams)
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
        this.contracted = !this.expanded;
        setTimeout(() => (this.showIcon = true), 330);
      });
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
    this.participEvBorder = "4px solid silver";
  }

  selectOrgnizeEvent() {
    this.participEvBorderDisplay = "none"
    this.orgnizeEvBorderDisplay = "initial"
    this.participEvBorder = "";
    this.orgnizeEvBorder = "4px solid silver";
  }
}
