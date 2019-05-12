import { Component, ViewChild } from "@angular/core";

import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  ModalController,
  Content,
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
  @ViewChild("content") content: Content;
  public userName;
  public commentText = "";
  public allComments = [];
  private liveComments = [];
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
      activeCommunity: this.navParams.get("activeCommunity"),
      notificationStatus: this.navParams.get("notificationStatus")
    };

    this.socket.emit("join", this.eventDetails.eventId);
    setTimeout(() => {
      this.socket.emit("getmessage", this.eventDetails.eventId);
    }, 200)

    this.eventDetails.participants.map(pr => {
      if (pr != null) {
        if (pr.participantId == this.tabParams.userId)
          this.isSubscribed = "Desinscrir";
      }
    });
  }

  scrolltobottomnfun() {
    if (this.content._scroll) {
      setTimeout(() => {
        this.content.scrollToBottom(0);
      }, 200);
    }
  }

  ionViewWillLoad() {
    this.eventProvider
      .getComments(this.tabParams, this.eventDetails)
      .subscribe(comments => {
        if (comments.conmments[0].messages.length != 0) {
          comments.conmments[0].messages.map(msg => {
            this.allComments.push({
              userId: msg.userId,
              photo: msg.userPhoto,
              username: msg.username,
              date: msg.dateOfCreation,
              comment: msg.userMessage
            });
          });
        }

        this.socket.on("live-message", data => {
          data.map(d => {
            this.liveComments.unshift(d);
            //this.scrolltobottomnfun();
          });

          if (this.liveComments.length != 0) {
            this.liveComments.map(cm => {
              this.allComments.push(cm);
            });
          }
        });
      });

    this.socket.on("broad-participants", data => {
      this.eventDetails.nbrSubscribedParticipants = data.length;
      this.eventDetails.participants = data;
    })

    this.profileProvider
      .getUserProfileByCommunityId(this.tabParams)
      .subscribe(profile => {
        this.profileInfo = {
          userId: profile.User[0].userId,
          photo: profile.User[0].profile.profilePhoto,
          username: profile.User[0].profile.profileLastname + " " + profile.User[0].profile.profileFirstname
        };
      });

    this.socket.on("broad-msg", data => {
      this.allComments.push(data);
      this.scrolltobottomnfun();
    });
  }

  ionViewWillLeave() {
    this.socket.disconnect(true);
    this.allComments = [];
  }

  compilemsg(): string {
    var msg =
      "Hello; \n Vous avez recu une invitation pour joindre l'événement : \n \
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
      \n Telecharge l'application Habee depui le app store pour rejoindre ta Communauté \n \n";
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
    if (value == true) (this.isSubscribed = "Desinscrir")
    else this.isSubscribed = "S'inscrir";

    this.eventProvider
      .getEventById(eventId, this.tabParams.token)
      .subscribe(response => {
        this.eventDetails.nbrSubscribedParticipants = response.Event[0].participants.length;
        this.eventDetails.participants = response.Event[0].participants;
        this.socket.emit("getSubDisubParticipants", {
          participants: response.Event[0].participants,
          eventId: this.eventDetails.eventId
        });
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
      check: 1,
      userDetails: userDetails,
      userId: userDetails.participantId,
      token: this.tabParams.token,
      activeCommunity: this.tabParams.activeCommunity
    };
    this.modalCtrl
      .create("PopupUserDetailModalPage", navInfo, { cssClass: "inset-modal" })
      .present();
  }

  onSubmit() {
    let comment = {
      eventId: this.eventDetails.eventId,
      eventCommunity: this.eventDetails.eventCommunity,
      userId: this.profileInfo.userId,
      photo: this.profileInfo.photo,
      username: this.profileInfo.username,
      date: moment(),
      comment: this.commentText
    };
    this.commentText = "";
    if (this.showComments == true)
      this.scrolltobottomnfun();
    this.eventProvider.emitSendMsg(comment);
  }

  transform(value) {
    moment.locale("fr");
    let a = moment(value).fromNow();
    return a;
    //return value.toLowerCase();
  }
}
