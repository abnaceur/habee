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
  public inputValidation = "";
  editCommunityForm: FormGroup;
  public url = ENV.BASE_URL;
  public chosenPicture;
  private tabParams: Object;
  private communityId;
  public comInfo = {
    title: "",
    description: "",
    logo: ""
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

  ionViewDidEnter() {

    this.communityProvider.getCommunityById(this.tabParams, this.communityId)
      .subscribe(data => {
        this.comInfo.logo = data.communityLogo;
        this.comInfo.title = data.communityName;
        this.comInfo.description = data.communityDescripton
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

    if (this.chosenPicture != undefined) {
      this.utils.uploadPhoto(this.chosenPicture)
        .then(comPhoto => {
          modifiedCommunity.logo = comPhoto;
          this.updateCommunity(modifiedCommunity)
        })
    } else {
      if (this.chosenPicture == undefined && this.comInfo.logo != "")
        modifiedCommunity.logo = this.comInfo.logo;
      this.updateCommunity(modifiedCommunity)
    }
  }

  updateCommunity(modifiedCommunity) {
    if (modifiedCommunity.communityTitle === "") {
      this.inputValidation = "Ce champs est obligatoir !";
    } else {
      this.communityProvider.putCommunity(this.communityId, this.tabParams, modifiedCommunity)
        .subscribe(data => {
          if (data === 200) {
            this.utils.notification("Cette Communauté est a jour", "top")
            this.dismiss();
          }
          else if (data === 202)
            this.inputValidation = "Ce nom exist !";
        })
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
