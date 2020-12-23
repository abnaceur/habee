import {
  Component
} from "@angular/core";


import {
  Platform,
  ActionSheetController,
  LoadingController,
  ToastController,
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  Events
} from 'ionic-angular';


import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';


import {
  environment as ENV
} from "../../environments/environment";

import {
  UtilsProvider
} from '../../providers/utils/utils';

import {
  CameraProvider
} from '../../providers/camera/camera';

import {
  ProfileProvider
} from '../../providers/profile/profile'

/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-edit-profile",
  templateUrl: "edit-profile.html"
})
export class EditProfilePage {
  modifierProfileForm: FormGroup;
  public url = ENV.BASE_URL;
  public chosenPicture;
  private tabParams: Object;
  public currentUser;

  constructor(
    public events: Events,
    private utils: UtilsProvider,
    private profileService: ProfileProvider,
    private actionsheetCtrl: ActionSheetController,
    public cameraProvider: CameraProvider,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    private toastController: ToastController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public viewCtrl: ViewController
  ) {

    this.modifierProfileForm = formBuilder.group({
      profileLastname: ['', Validators.compose([Validators.required])],
      profileFirstname: ['', Validators.compose([Validators.required])],
    });

    this.tabParams = this.navParams.get("info");
    this.currentUser = this.navParams.get("user");
  }


  ionViewWillEnter() {
    this.tabParams = this.navParams.get("info");
    this.currentUser = this.navParams.get("user");
  }

  dismiss() {
    this.viewCtrl.dismiss(true);
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

  onSubmit(editProfile) {
    if (editProfile.profileFirstname === "")
      editProfile.profileFirstname = this.currentUser.profileFirstname;
    if (editProfile.profileLastname === "")
      editProfile.profileLastname = this.currentUser.profileLastname;

    if (this.chosenPicture === undefined && this.currentUser.profilePhoto != undefined)
      this.chosenPicture = this.currentUser.profilePhoto

    if (this.chosenPicture === undefined) {
      this.profileService.editProfil(editProfile, this.chosenPicture, this.tabParams)
        .subscribe(data => {
          if (data === 200) {
            this.events.publish('profile:modified', editProfile, this.chosenPicture);
            this.utils.notification("Profil mis à jour", "top");
            this.dismiss();
          }
          if (data != 200)
            this.utils.notification("Une erreur est survenu !", "top");
        })
    } else if (this.chosenPicture != undefined && this.chosenPicture.length < 100) {
      this.profileService.editProfil(editProfile, this.chosenPicture, this.tabParams)
        .subscribe(data => {
          if (data === 200) {
            this.events.publish('profile:modified', editProfile, this.chosenPicture);
            this.utils.notification("Votre profile est mise a jour !", "top");
            this.dismiss();
          }
          if (data != 200)
            this.utils.notification("Une erreur est survenu !", "top");
        })
    } else {
      this.utils.uploadPhoto(this.chosenPicture).then(data => {
        this.profileService.editProfil(editProfile, data, this.tabParams)
          .subscribe(data => {
            if (data === 200) {
              this.utils.notification("Votre profile est mise a jour !", "top");
              this.events.publish('profile:modified', editProfile, data);
              this.dismiss();
            }
            if (data != 200)
              this.utils.notification("Une erreur est survenu !", "top");
          })
      })
    }
  }
}
