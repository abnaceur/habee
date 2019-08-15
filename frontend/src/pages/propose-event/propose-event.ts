import { Component } from "@angular/core";

import {
  Platform,
  ActionSheetController,
  LoadingController,
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  ViewController
} from "ionic-angular";

import { CalendarModal, CalendarModalOptions, DayConfig, CalendarResult } from "ion2-calendar";


import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from "@angular/forms";

import { CameraProvider } from "../../providers/camera/camera";

import { CommunityProvider } from "../../providers/community/community";

import { EventProvider } from "../../providers/event/event";

import { environment as ENV } from "../../environments/environment";

import { UtilsProvider } from "../../providers/utils/utils";

import { ProposeEventProvider } from "../../providers/propose-event/propose-event";

import { Socket } from "ng-socket-io";
import { dateDataSortValue } from "ionic-angular/umd/util/datetime-util";

/**
 * Generated class for the ProposeEventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-propose-event",
  templateUrl: "propose-event.html"
})
export class ProposeEventPage {
  proposeEventForm: FormGroup;
  public currentDate = "2018";
  myDate: String = new Date().toISOString();
  private listCommunity = [];
  public validateCommunities = "";
  public validateStartEndData = "";
  placeholder = "../../assets/img/avatar/girl-avatar.png";
  chosenPicture: any;
  public tabParams;
  public url = ENV.BASE_URL;
  allfilters: any;
  public eventStartDate = "";
  public eventEndDate = "";
  public dateLabel = "Date de debut/fin";
  private endStartDate;
  public allCommunities = [];
  public selectedCommunity = [];

  constructor(
    private communityProvider: CommunityProvider,
    private socket: Socket,
    public modalCtrl: ModalController,
    private proposeEventProvider: ProposeEventProvider,
    private utils: UtilsProvider,
    public eventProvider: EventProvider,
    public formBuilder: FormBuilder,
    public actionsheetCtrl: ActionSheetController,
    public cameraProvider: CameraProvider,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams
  ) {
    this.tabParams = {
      userId: this.navParams.data.userInfo.userId,
      token: this.navParams.data.userInfo.token,
      activeCommunity: this.navParams.data.userInfo.activeCommunity,
      notificationStatus: this.navParams.data.userInfo.notificationStatus
    };

    this.allfilters = this.eventProvider.allFilters;

    this.proposeEventForm = formBuilder.group({
      eventTitle: ["", Validators.compose([Validators.required])],
      eventLocation: ["", Validators.compose([])],
      eventNbrParticipants: [2, Validators.compose([Validators.required])],
      eventDescription: ["", Validators.compose([])],
      eventStartHour: ["00:00", Validators.compose([])],
      eventEndHour: ["00:00", Validators.compose([])],
      eventIsPublic: [false, Validators.compose([Validators.required])],
      eventCategory: ["Autres", Validators.compose([])]
    });
  }

  initListCommunity(communities) {
    let coms = [];

    communities.map(com => {
      coms.push({
        id: com.communityId,
        value: com.communityName,
        selected: false
      })
    })

    this.allCommunities = coms;
  }

  getAllCommunities() {
    this.communityProvider
      .getCommunitiesbyCreator(this.tabParams)
      .subscribe(dataCreator => {
        this.communityProvider
          .getCommunitiesByParticipation(this.tabParams)
          .subscribe(dataParticipation => {
            dataCreator.communities = dataCreator.communities.concat(dataParticipation);
            this.initListCommunity(dataCreator.communities);
          });
      });
  }

  ionViewWillEnter() {
    this.getAllCommunities()
  }

  ionViewWillLeave() {
    this.socket.disconnect(true);
    console.log("Diconnected");
  }

  changePicture() {
    const actionsheet = this.actionsheetCtrl.create({
      title: "upload picture",
      buttons: [
        {
          text: "camera",
          icon: !this.platform.is("ios") ? "camera" : null,
          handler: () => {
            this.takePicture();
          }
        },
        {
          text: !this.platform.is("ios") ? "gallery" : "camera roll",
          icon: !this.platform.is("ios") ? "image" : null,
          handler: () => {
            this.getPicture();
          }
        },
        {
          text: "cancel",
          icon: !this.platform.is("ios") ? "close" : null,
          role: "destructive",
          handler: () => {
            console.log("the user has cancelled the interaction.");
          }
        }
      ]
    });
    return actionsheet.present();
  }

  takePicture() {
    const loading = this.loadingCtrl.create();

    loading.present();
    return this.cameraProvider.getPictureFromCamera().then(
      picture => {
        if (picture) {
          this.chosenPicture = picture;
        }
        loading.dismiss();
      },
      error => {
        alert(error);
      }
    );
  }

  getPicture() {
    const loading = this.loadingCtrl.create();

    loading.present();
    return this.cameraProvider.getPictureFromPhotoLibrary().then(
      picture => {
        if (picture) {
          this.chosenPicture = picture;
        }
        loading.dismiss();
      },
      error => {
        alert(error);
      }
    );
  }

  selectedCommunityList(com) {
    if (com.selected === true)
      this.listCommunity.push(com.id);
    else
      this.listCommunity.splice(this.listCommunity.indexOf(com.id), 1)
  }

  onSubmit(value) {
    if (this.eventStartDate != "") {
      value.eventStartDate = this.endStartDate.from.years + "-" + this.endStartDate.from.months + "-" + this.endStartDate.from.date;
      value.eventEndDate = this.endStartDate.to.years + "-" + this.endStartDate.to.months + "-" + this.endStartDate.to.date;;
      if (this.listCommunity.length > 0 && this.listCommunity != null) {
        if (this.chosenPicture) {
          this.eventProvider.uploadPhoto(this.chosenPicture).then(data => {
            this.eventProvider
              .addEventByCommunity(
                value,
                this.tabParams,
                data,
                this.listCommunity
              )
              .subscribe(response => {
                if (response.results == true) {
                  this.utils.notification("Event cree avec succes !", "top");
                  this.proposeEventProvider.emitnewCreatedEvent(response.Event);
                } else this.utils.notification("Une erreur est apparus !", "top");
              });
          });
        } else {
          this.eventProvider
            .addEventByCommunity(value, this.tabParams, this.chosenPicture, this.listCommunity)
            .subscribe(response => {
              if (response.results == true) {
                this.utils.notification("Event cree avec succes !", "top");
                this.proposeEventProvider.emitnewCreatedEvent(response.Event);
                //this.viewCtrl.dismiss();
              } else this.utils.notification("Une erreur est apparus !", "top");
            });
        }
      } else
        this.validateCommunities = "Vous devez selectionne une communaute";
    } else
      this.validateStartEndData = "Vous devez selectionne une date de debut/fin";
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  openCommunityList() {
    this.validateCommunities = "";
    const modal = this.modalCtrl.create(
      "CommunityEventListPage",
      this.tabParams,
      { cssClass: "comEvent-modal" }
    );
    modal.onDidDismiss(data => {
      if (data.length == 0) this.listCommunity.push(this.tabParams.activeCommunity);
      else if (data.length > 0) this.listCommunity = data;
    });
    modal.present();

  }

  openCalendar() {
    this.validateStartEndData = "";
    const options: CalendarModalOptions = {
      pickMode: 'range',
      title: '',
      color: "primary",
      weekStart: 1,
      weekdays: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      closeIcon: true,
      doneIcon: true,
      canBackwardsSelected: false,

    };

    let myCalendar = this.modalCtrl.create(CalendarModal, {
      options: options
    });

    myCalendar.present();

    myCalendar.onDidDismiss((date: { from: CalendarResult; to: CalendarResult }, type: string) => {
      if (date != null) {
        this.eventStartDate = date.from.date + '/' + date.from.months + '/' + date.from.years;
        this.eventEndDate = date.to.date + '/' + date.to.months + '/' + date.to.years;
        this.dateLabel = this.eventStartDate + " - " + this.eventEndDate;
        this.endStartDate = date;
      }
    });
  }
}
