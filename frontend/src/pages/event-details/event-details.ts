import { Component } from "@angular/core";

import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  ModalController,
  ActionSheetController
} from "ionic-angular";

import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from "@angular/forms";

import { Socket } from "ng-socket-io";

import moment from "moment";

import { environment as ENV } from "../../environments/environment";

import { EventProvider } from "../../providers/event/event";

import { Http } from "@angular/http";

import { UtilsProvider } from "../../providers/utils/utils";

import { SocialSharing } from "@ionic-native/social-sharing";

import { ProfileProvider } from "../../providers/profile/profile";

/**
 * Generated class for the EventDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-event-details",
  templateUrl: "event-details.html"
})
export class EventDetailsPage {
  public userName;
  public commentText = "";
  public allComments = [];
  public profileInfo;
  public tabParams;
  public showComments = false;
  public subPassions;
  public url = ENV.BASE_URL;
  eventDetails: {
    eventId: string;
    eventCommunity: string;
    eventName: string;
    eventCreator: string;
    eventDescription: string;
    eventStartDate: string;
    eventStartHour: String;
    eventEndDate: string;
    eventEndHour: String;
    eventLocation: string;
    nbrParticipants: 0;
    nbrSubscribedParticipants: number;
    participants: [
      {
        participantId: string;
      }
    ];
    eventIsOver: false;
    eventIsDeleted: false;
  };
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
  public isSubscribed = "S'inscrir";
  quotes: any;

  constructor(
    private socket: Socket,
    private profileProvider: ProfileProvider,
    private socialSharing: SocialSharing,
    private utils: UtilsProvider,
    public actionSheetCtrl: ActionSheetController,
    private http: Http,
    public formBuilder: FormBuilder,
    private toastController: ToastController,
    public eventProvider: EventProvider,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams
  ) {
    this.socket.connect();
    this.eventDetails = navParams.get("data");
    this.tabParams = {
      userId: this.navParams.get("userId"),
      token: this.navParams.get("token"),
      activeCommunity: this.navParams.get("activeCommunity")
    };

    this.eventDetails.participants.map(pr => {
      if (pr != null) {
        if (pr.participantId == this.tabParams.userId)
          this.isSubscribed = "Desinscrir";
      }
    });
  }

  ionViewWillLoad() {
    this.socket.emit("getmessage");
    this.eventProvider
      .getComments(this.tabParams, this.eventDetails)
      .subscribe(comments => {
        if (comments.conmments.length != 0)
          this.allComments.push(comments.conmments);
        console.log("All comments : ", this.allComments);
      });

    this.profileProvider
      .getUserProfileByCommunityId(this.tabParams)
      .subscribe(profile => {
        console.log("Profile :", profile.User[0].profile.profilePhoto);
        this.profileInfo = {
          userId: profile.User[0].userId,
          photo: profile.User[0].profile.profilePhoto,
          username: profile.User[0].profile.profileUsername
        };
      });

    this.socket.on("live-message", data => {
      console.log("Live msg 1:", data);
      data.map(d => {
        this.allComments.push(d);
      });
      console.log("Push live : ", this.allComments);
    });

    this.socket.on("broad-msg", data => {
      console.log("Broadcast msg 1:", data);
      this.allComments.push(data);
      console.log("Push : ", this.allComments);
    });
  }

  ionViewWillLeave() {
    this.socket.disconnect(true);
    this.allComments = [];
  }

  compilemsg(): string {
    var msg =
      "Hello; \n Vous avez recu une invitation pour joindre l'evenement : \n \
    Titre : " +
      this.eventDetails.eventName +
      "\n \
    Date debut : " +
      this.eventDetails.eventStartDate.substring(8, 10) +
      "." +
      this.eventDetails.eventStartDate.substring(5, 7) +
      "." +
      this.eventDetails.eventStartDate.substring(0, 4) +
      " " +
      this.eventDetails.eventStartHour +
      " \n \
    Date de fin : " +
      this.eventDetails.eventEndDate.substring(8, 10) +
      " " +
      this.eventDetails.eventEndDate.substring(5, 7) +
      " " +
      this.eventDetails.eventEndDate.substring(0, 4) +
      " " +
      this.eventDetails.eventEndHour +
      "\n \
      \n Telecharge l'application Habee depui le app store pour rejoindre ta communaute \n \n";
    return msg.concat(" \n Envoyer depuis l'application Habee.");
  }

  regularShare() {
    var msg = this.compilemsg();
    this.socialSharing.share(msg, null, null, null);
  }

  twitterShare() {
    var msg = this.compilemsg();
    this.socialSharing.shareViaTwitter(msg, null, null);
  }

  whatsappShare() {
    var msg = this.compilemsg();
    this.socialSharing.shareViaWhatsApp(msg, null, null);
  }

  facebookShare() {
    var msg = this.compilemsg();
    this.socialSharing.shareViaFacebook(msg, null, null);
  }

  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: "Partager",
      buttons: [
        {
          icon: "logo-whatsapp",
          text: "Depuis Whatsapp",
          role: "Whatsapp",
          cssClass: "logo-whatsappClass",
          handler: () => {
            this.whatsappShare();
          }
        },
        {
          icon: "logo-facebook",
          text: "Depuis facebook",
          role: "logo-facebook",
          cssClass: "logo-facebookClass",
          handler: () => {
            this.facebookShare();
          }
        },
        {
          icon: "logo-twitter",
          text: "Depuis twitter",
          role: "logo-twitter",
          cssClass: "logo-twitterClass",
          handler: () => {
            this.twitterShare();
          }
        },
        {
          icon: "mail",
          text: "Autre option",
          role: "mail",
          cssClass: "mail",
          handler: () => {
            this.regularShare();
          }
        },
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });
    actionSheet.present();
  }

  updateParticipantsList(value, eventId) {
    value == true
      ? ((this.eventDetails.nbrSubscribedParticipants =
          this.eventDetails.nbrSubscribedParticipants + 1),
        (this.isSubscribed = "Desinscrir"))
      : ((this.isSubscribed = "S'inscrir"),
        (this.eventDetails.nbrSubscribedParticipants =
          this.eventDetails.nbrSubscribedParticipants - 1));
    this.eventProvider
      .getEventById(eventId, this.tabParams.token)
      .subscribe(response => {
        this.eventDetails.participants = response.Event[0].participants;
      });
  }

  subscribeToEvent(eventId) {
    this.eventProvider
      .getEventSubscription(eventId, this.tabParams)
      .subscribe(response => {
        if (response.Subscribe == true) {
          this.updateParticipantsList(true, eventId);
          this.utils.notification("inscription reussie !", "top");
        } else if (response.Subscribe == false) {
          this.updateParticipantsList(false, eventId);
          this.utils.notification("Desinscription reussie !", "top");
        }
      });
  }

  openUserDetailsModal(userDetails) {
    let navInfo = {
      userId: userDetails.participantId,
      token: this.tabParams.token,
      activeCommunity: this.tabParams.activeCommunity
    };
    this.modalCtrl
      .create("PopupUserDetailModalPage", navInfo, { cssClass: "inset-modal" })
      .present();
  }

  sendMsg() {
    console.log("Here inside");
  }

  onSubmit() {
    console.log("Date.now", moment().toNow());
    let comment = {
      userId: this.profileInfo.userId,
      photo: this.profileInfo.photo,
      username: this.profileInfo.username,
      date: moment(),
      comment: this.commentText
    };
    console.log("Comment : ", comment);
    this.eventProvider.emitSendMsg(comment);
  }

  transform(value) {
    moment.locale("fr");
    let a = moment(value).fromNow();
    return a;
    //return value.toLowerCase();
  }
}
