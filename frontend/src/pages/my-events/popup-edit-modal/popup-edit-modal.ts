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

import { EventProvider } from "../../../providers/event/event";

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

  constructor(
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
      eventStartDate: ["", Validators.compose([Validators.required])],
      eventEndDate: ["", Validators.compose([Validators.required])],
      eventStartHour: ["", Validators.compose([Validators.required])],
      eventEndHour: ["", Validators.compose([Validators.required])],
      eventIsPublic: [false, Validators.compose([Validators.required])],
      eventCategory: ["", Validators.compose([Validators.required])]
    });

    this.eventDetails = this.navParams.data.event;
    this.tabParams = this.navParams.data.userInfo;

    console.log("eventDetails : ", this.eventDetails);
  
    this.chosenPicture = this.eventDetails.eventPhoto;

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

  onSubmit(event) {
    if (this.listCommunity.length > 0 && this.listCommunity != null) {
      event.eventCommunity = this.listCommunity;
      if (this.chosenPicture != this.eventDetails.eventPhoto) {
        this.eventProvider.uploadPhoto(this.chosenPicture).then(data => {
          this.eventProvider
            .editEvent(event, data, this.eventDetails, this.tabParams)
            .subscribe(response => {
              console.log("Resoponse edit : ", response)
              if (response.message == "success") {
                this.utils.notification("Event modifier avec succes", "top");
              } else {
                this.utils.notification("Une erreur est survenu !", "top");
              }
            });
        });
      } else {
        this.eventProvider
          .editEvent(event, this.chosenPicture, this.eventDetails, this.tabParams)
          .subscribe(response => {
            console.log("Resoponse edit 1: ", response)
            if (response.message == "success") {
              this.utils.notification("Event modifier avec succes", "top");
            } else {
              this.utils.notification("Une erreur est survenu !", "top");
            }
          });
      }
    } else {
      this.utils.notification("Vous devez selectionne une communaute", "top");
    }
  }

  openCommunityList() {
    const modal = this.modalCtrl.create(
      "CommunityEventListPage",
      this.tabParams,
      { cssClass: "comEvent-modal" }
    );
    modal.onDidDismiss(data => {
      console.log("Daa ===> :", data);
      if (data != null && data.length == 0)
        this.listCommunity.push(this.tabParams.activeCommunity);
      else if (data != null && data.length > 0) this.listCommunity = data;
    });
    modal.present();
  }
}
