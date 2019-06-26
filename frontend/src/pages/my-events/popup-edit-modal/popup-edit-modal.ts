import { Component } from "@angular/core";

import {
  Platform,
  ActionSheetController,
  LoadingController,
  ToastController,
  IonicPage,
  ModalController,
  NavController,
  NavParams,
  ViewController
} from "ionic-angular";

import { CameraProvider } from "../../../providers/camera/camera";

import { CalendarModal, CalendarModalOptions, DayConfig, CalendarResult } from "ion2-calendar";

import { EventProvider } from "../../../providers/event/event";

import { CommunityProvider } from "../../../providers/community/community";

import { environment as ENV } from "../../../environments/environment";

import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from "@angular/forms";

import { UtilsProvider } from "../../../providers/utils/utils";

/**
 * Generated class for the PopupEditModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-popup-edit-modal",
  templateUrl: "popup-edit-modal.html"
})
export class PopupEditModalPage {
  editEventForm: FormGroup;
  public eventDetails;
  public tabParams;
  public chosenPicture;
  private listCommunity = [];
  public url = ENV.BASE_URL;
  public validateCommubities = "";

  public eventStartDate = "";
  public eventEndDate = "";
  public dateLabel = "Date de debut/fin";
  private endStartDate;
  public allCommunities = [];

  constructor(
    private communityProvider: CommunityProvider,
    public utils: UtilsProvider,
    public modalCtrl: ModalController,
    public eventProvider: EventProvider,
    public actionsheetCtrl: ActionSheetController,
    public cameraProvider: CameraProvider,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    private toastController: ToastController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private _FB: FormBuilder,
    public viewCtrl: ViewController
  ) {
    this.editEventForm = formBuilder.group({
      eventTitle: ["", Validators.compose([Validators.required])],
      eventLocation: ["", Validators.compose([Validators.required])],
      eventNbrParticipants: ["", Validators.compose([Validators.required])],
      eventDescription: ["", Validators.compose([Validators.required])],
      eventStartHour: ["", Validators.compose([Validators.required])],
      eventEndHour: ["", Validators.compose([Validators.required])],
      eventIsPublic: [false, Validators.compose([Validators.required])],
      eventCategory: ["", Validators.compose([Validators.required])]
    });

    this.eventDetails = this.navParams.data.event;
    this.tabParams = this.navParams.data.userInfo;

    this.chosenPicture = this.eventDetails.eventPhoto;

    this.eventStartDate = this.eventDetails.eventStartDate;
    this.eventEndDate = this.eventDetails.eventEndDate;

    console.log("event : ==> ", this.eventDetails);
    this.editEventForm = this._FB.group({
      eventId: [this.eventDetails.eventId],
      eventTitle: [this.eventDetails.eventName],
      eventLocation: [this.eventDetails.eventLocation],
      eventNbrParticipants: [this.eventDetails.nbrParticipants],
      eventDescription: [this.eventDetails.eventDescription],
      eventStartDate: [this.eventDetails.eventStartDate],
      eventEndDate: [this.eventDetails.eventStartDate],
      eventStartHour: [this.eventDetails.eventStartHour],
      eventCategory: [this.eventDetails.eventCategory],
      eventEndHour: [this.eventDetails.eventEndHour],
      eventIsPublic: [this.eventDetails.eventIsPublic]
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ionViewWillEnter() {
    this.getAllCommunities()
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

  onSubmit(event) {

    if (this.listCommunity.length > 0 && this.listCommunity != null) {
      event.eventCommunity = this.listCommunity;
      if (this.chosenPicture != this.eventDetails.eventPhoto) {
        this.eventProvider.uploadPhoto(this.chosenPicture).then(data => {
          this.eventProvider
            .editEvent(event, data, this.eventDetails, this.tabParams)
            .subscribe(response => {
              if (response.message == "success") {
                this.utils.notification("Event modifier avec succes", "top");
                this.dismiss();
              } else {
                this.utils.notification("Une erreur est survenu !", "top");
              }
            });
        });
      } else {
        this.eventProvider
          .editEvent(event, this.chosenPicture, this.eventDetails, this.tabParams)
          .subscribe(response => {
            if (response.message == "success") {
              this.utils.notification("Event modifier avec succes", "top");
              this.dismiss();
            } else {
              this.utils.notification("Une erreur est survenu !", "top");
            }
          });
      }
    } else {
      this.validateCommubities = "Vous devez selectionne une communaute";
    }
  }

  openCommunityList() {
    const modal = this.modalCtrl.create(
      "CommunityEventListPage",
      this.tabParams,
      { cssClass: "comEvent-modal" }
    );
    modal.onDidDismiss(data => {
      if (data != null && data.length == 0)
        this.listCommunity.push(this.tabParams.activeCommunity);
      else if (data != null && data.length > 0) this.listCommunity = data;
    });
    modal.present();
  }

  openCalendar() {
    const options: CalendarModalOptions = {
      pickMode: 'range',
      title: '',
      cssClass: 'calamdarCustomColor',
      weekdays: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      closeIcon: true,
      defaultDateRange: { from: this.eventDetails.eventStartDate, to: this.eventDetails.eventEndDate },
      doneIcon: true,
      canBackwardsSelected: true,
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

  isInArray(arr, index) {
    let check = 0;

    arr.map(ar => {
      console.log("Ar == index", ar, index);
      if (ar.toString() == index.toString()) {
        check = 1;
      }
    })

    if (check == 1)
    return true;
    else
    return false;
  }

  initListCommunity(communities) {
    let coms = [];

    communities.map(com => {
      if (this.isInArray(this.eventDetails.eventCommunity, com.communityId) === true) {
        coms.push({
          id: com.communityId,
          value: com.communityName,
          selected: true
        })
        this.listCommunity.push(com.communityId);
      } else {
        coms.push({
          id: com.communityId,
          value: com.communityName,
          selected: false
        })
      }
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
}
