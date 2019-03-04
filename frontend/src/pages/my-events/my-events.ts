import { Component } from "@angular/core";

import {
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
  public tabParams;

  // Not used var TODO CHECK AND DELETE
  items1 = [
    {
      imageUrl: "assets/img/lists/stadium.jpg",
      title: "First Cup",
      place: "Madison Square",
      date: "05/06/2016"
    },
    {
      imageUrl: "assets/img/lists/stadium-3.png",
      title: "Season",
      place: "Hooli",
      date: "15/03/2016"
    },
    {
      imageUrl: "assets/img/lists/stadium-2.jpg",
      title: "2nd Season",
      place: "Castelão",
      date: "05/12/2015"
    }
  ];
  eventParticipated = [
    {
      name: "Evenement participer"
    }
  ];

  eventPropose = [
    {
      name: "Evenement proposer"
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
        this.userInfo = response.User[0].eventsParticipated;
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
          } else this.proposedEvents = response.Events;
        });
      this.utils.notification("Event suprimer avec succes", "top");
    } else {
      this.utils.notification("Une erreur est survenu !", "top");
    }
  }

  deleteEvent(event) {
    if (event.participants.length != 0) {
      this.utils.notification(
        "Vous ne pouvez pas suprimer cet event car il contien des participants !",
        "top"
      );
    } else {
      this.eventProvider
        .deleteTheiEvent(event, this.tabParams)
        .subscribe(response => {
          this.deleteEventResponse(response);
        });
    }
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
}
