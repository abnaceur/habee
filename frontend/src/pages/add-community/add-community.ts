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
  environment as ENV
} from '../../environments/environment';

import {
  CommunityProvider
} from '../../providers/community/community';


import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';

import {
  UtilsProvider
} from '../../providers/utils/utils';

import {
  CameraProvider
} from '../../providers/camera/camera';
import { e } from '@angular/core/src/render3';

/**
 * Generated class for the AddCommunityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-community',
  templateUrl: 'add-community.html',
})
export class AddCommunityPage {
  addCommunityForm: FormGroup;
  public url = ENV.BASE_URL;
  public chosenPicture;
  private tabParams: Object;
  public inputValidation = "";

  constructor(
    public utils: UtilsProvider,
    public actionsheetCtrl: ActionSheetController,
    public cameraProvider: CameraProvider,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    private toastController: ToastController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private communityProvider: CommunityProvider,
    private _FB: FormBuilder,
    public viewCtrl: ViewController
  ) {

    this.addCommunityForm = formBuilder.group({
      communityTitle: ['', Validators.compose([Validators.required])],
      communityDescription: ['', Validators.compose([Validators.required])],
    });

    this.tabParams = {
      userId: this.navParams.get("userId"),
      token: this.navParams.get("token"),
      activeCommunity: this.navParams.get('activeCommunity'),
      notificationStatus: this.navParams.get("notificationStatus")
    };
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

  ionViewCanLeave() {
    this.inputValidation = "";
  }

  onSubmit(newCommunity) {

    if (newCommunity.communityTitle === "") {
      this.inputValidation = "Ce champs est obligatoir !";
    } else if (this.chosenPicture === undefined) {
      this.communityProvider.addCommunity(newCommunity, this.chosenPicture, this.tabParams)
        .subscribe(data => {
          if (data === 0) {
            this.inputValidation = "Ce nom exist !";
          }
          if (data === 1) {
            this.dismiss();
            this.utils.notification("Team créée avec succès", "top");
          }
        })
    } else {
      this.utils.uploadPhoto(this.chosenPicture)
        .then(dataPhoto => {
          this.communityProvider.addCommunity(newCommunity, dataPhoto, this.tabParams)
            .subscribe(data => {
              if (data === 0) {
                this.inputValidation = "Ce nom exist !";
              }
              if (data === 1) {
                this.dismiss();
                this.utils.notification("Votre Communauté est ajouter avec success !", "top");
              }
            })
        })
    }
  }

}
