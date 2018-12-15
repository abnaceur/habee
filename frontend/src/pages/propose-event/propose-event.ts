import { Component } from '@angular/core';

import {
  Platform,
  ActionSheetController,
  LoadingController,
  IonicPage, NavController, NavParams,
  ViewController,
  ToastController
} from 'ionic-angular';


import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  AbstractControl 
} from '@angular/forms';

import { 
  CameraProvider 
} from '../../providers/camera/camera';

import { 
  EventProvider 
} from '../../providers/event/event';

import { 
  environment as ENV 
} from '../../environments/environment';


/**
 * Generated class for the ProposeEventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-propose-event',
  templateUrl: 'propose-event.html',
})
export class ProposeEventPage {
  proposeEventForm: FormGroup;
  public currentDate = "2018";
  myDate: String = new Date().toISOString();


  placeholder = '../../assets/img/avatar/girl-avatar.png';
  chosenPicture: any;
  public tabParams;
  public url = ENV.BASE_URL;

  constructor(
    public eventProvider: EventProvider,
    public formBuilder: FormBuilder,
    public actionsheetCtrl: ActionSheetController,
    public cameraProvider: CameraProvider,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    private toastController: ToastController, 
    public viewCtrl: ViewController,
    public navParams: NavParams) {

    this.tabParams = {
      userId: this.navParams.data.userInfo.userId,
      token: this.navParams.data.userInfo.token,
      activeCommunity: this.navParams.data.userInfo.activeCommunity
    };

    this.proposeEventForm = formBuilder.group({
      eventTitle: ['', Validators.compose([Validators.required])],
      eventLocation: ['', Validators.compose([Validators.required])],
      eventNbrParticipants: ['', Validators.compose([Validators.required])],
      eventDescription: ['', Validators.compose([Validators.required])],
      eventStartDate: ['', Validators.compose([Validators.required])],
      eventEndDate: ['', Validators.compose([Validators.required])],
      eventStartHour: ['', Validators.compose([Validators.required])],
      eventEndHour: ['', Validators.compose([Validators.required])],
      eventCategory: ['', Validators.compose([Validators.required])],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProposeEventPage');
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

  onSubmit(value) {
    let uploadSucessToast = this.toastController.create({
      message: "Event cree avec succes !",
      duration: 2000,
      position: 'top',
      cssClass: "uploadSucessClass"
    });
    
    let uploadFailedToast = this.toastController.create({
      message: "Une erreur est apparus !",
      duration: 2000,
      position: 'top',
      cssClass: "uploadFailedClass"
    });

    if (this.chosenPicture) {
    this.eventProvider.uploadPhoto(this.chosenPicture)
    .then(data => {
      console.log("Returned Data : ", data)
      this.eventProvider.addEventByCommunity(value, this.tabParams, data)
      .subscribe(response => {
        console.log("this 111 : ", response)
        if (response.results == true) {
          uploadSucessToast.present();
        } else {
          uploadFailedToast.present();
        }
        });
    })
    } else {
      this.eventProvider.addEventByCommunity(value, this.tabParams, this.chosenPicture)
      .subscribe(response => {
        console.log("this 111 : ", response)
        if (response.results == true) {
          uploadSucessToast.present();
        } else {
          uploadFailedToast.present();
        }
        });
    }
    
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
