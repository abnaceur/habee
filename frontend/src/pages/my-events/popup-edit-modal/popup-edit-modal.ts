import {
  Component
} from '@angular/core';

import {
  Platform,
  ActionSheetController,
  LoadingController,
  ToastController,
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from 'ionic-angular';


import { 
  CameraProvider 
} from '../../../providers/camera/camera';

import { 
  EventProvider 
} from '../../../providers/event/event';


import {
  environment as ENV
} from '../../../environments/environment';

import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';

import {
  UtilsProvider
} from '../../../providers/utils/utils';

/**
 * Generated class for the PopupEditModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-popup-edit-modal',
  templateUrl: 'popup-edit-modal.html',
})
export class PopupEditModalPage {
  editEventForm: FormGroup;
  public eventDetails;
  public tabParams;
  public chosenPicture;
  public url = ENV.BASE_URL;

  constructor(
    public utils: UtilsProvider,
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
      eventTitle: ['', Validators.compose([Validators.required])],
      eventLocation: ['', Validators.compose([Validators.required])],
      eventNbrParticipants: ['', Validators.compose([Validators.required])],
      eventDescription: ['', Validators.compose([Validators.required])],
      eventStartDate: ['', Validators.compose([Validators.required])],
      eventEndDate: ['', Validators.compose([Validators.required])],
      eventStartHour: ['', Validators.compose([Validators.required])],
      eventEndHour: ['', Validators.compose([Validators.required])],
    });

    this.tabParams = this.navParams.data.event

  }

  ionViewWillEnter() {
    this.chosenPicture = this.tabParams.eventPhoto;

      this.editEventForm = this._FB.group({
        "eventId": [this.tabParams.eventId],
        "eventTitle": [this.tabParams.eventName],
        "eventLocation": [this.tabParams.eventLocation],
        "eventNbrParticipants": [this.tabParams.nbrParticipants],
        "eventDescription": [this.tabParams.eventDescription],
        "eventStartDate": [this.tabParams.eventStartDate],
        "eventEndDate": [this.tabParams.eventStartDate],
        "eventStartHour": [this.tabParams.eventStartHour],
        "eventEndHour": [this.tabParams.eventEndHour],
      })
    
    this.eventDetails = this.tabParams
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  changePicture() {

    const actionsheet = this.actionsheetCtrl.create({
      title: 'upload picture',
      buttons: [
        {
          text: 'camera',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            this.takePicture();
          }
        },
        {
          text: !this.platform.is('ios') ? 'gallery' : 'camera roll',
          icon: !this.platform.is('ios') ? 'image' : null,
          handler: () => {
            this.getPicture();
          }
        },
        {
          text: 'cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          role: 'destructive',
          handler: () => {
            console.log('the user has cancelled the interaction.');
          }
        }
      ]
    });
    return actionsheet.present();
  }

  takePicture() {
    const loading = this.loadingCtrl.create();

    loading.present();
    return this.cameraProvider.getPictureFromCamera().then(picture => {
      if (picture) {
        this.chosenPicture = picture;
      }
      loading.dismiss();
    }, error => {
      alert(error);
    });
  }

  getPicture() {
    const loading = this.loadingCtrl.create();

    loading.present();
    return this.cameraProvider.getPictureFromPhotoLibrary().then(picture => {
      if (picture) {
        this.chosenPicture = picture;
      }
      loading.dismiss();
    }, error => {
      alert(error);
    });
  }

  onSubmit(event) {

    this.eventProvider.editEvent(event, this.chosenPicture,  this.navParams.data.userInfo)
    .subscribe(response => {
      if (response.message == "success") {
        this.utils.notification("Event modifier avec succes", "top");
      } else {
        this.utils.notification("Une erreur est survenu !", "top");     
      }
      });
  }


}
