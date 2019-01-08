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


/**
 * Generated class for the EditCommunityModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-community-modal',
  templateUrl: 'edit-community-modal.html',
})
export class EditCommunityModalPage {

  editCommunityForm: FormGroup;
  public url = ENV.BASE_URL;
  public chosenPicture;
  private tabParams: Object;
  private communityId;
  public comInfo = {
    title: "",
    description: ""
  }

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

    this.tabParams = this.navParams.data.userInfo;
    this.communityId = this.navParams.data.selectCommunity

    this.editCommunityForm = formBuilder.group({
      communityTitle: ["", Validators.compose([Validators.required])],
      communityDescription: ["", Validators.compose([Validators.required])],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditCommunityModalPage');
  }

  ionViewDidEnter() {

    this.communityProvider.getCommunityById(this.tabParams, this.communityId)
      .subscribe(data => {
        this.comInfo.title = data.community[0].communityName;
        this.comInfo.description = data.community[0].communityDescripton
      })
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

  onSubmit(modifiedCommunity) {

    modifiedCommunity.communityDescription == "" ?
      modifiedCommunity.communityDescription = this.comInfo.description
      : modifiedCommunity.communityDescription

    modifiedCommunity.communityTitle == "" ?
      modifiedCommunity.communityTitle = this.comInfo.title
      : modifiedCommunity.communityTitle

    if (this.chosenPicture) {
      this.utils.uploadPhoto(this.chosenPicture)
        .then(comPhoto => {
          this.communityProvider.putCommunity(this.communityId, this.tabParams, modifiedCommunity, comPhoto)
        })
    } else {
      this.communityProvider.putCommunity(this.communityId, this.tabParams, modifiedCommunity, this.chosenPicture)
        .subscribe(data => {
          if (data === 200)
            this.utils.notification("Cette communaute est a jour", "top")
          else if (data === 202)
            this.utils.notification("Ce nom exist !", "top")
        })
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
