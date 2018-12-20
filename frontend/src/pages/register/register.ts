import { Component, ViewChild } from "@angular/core";

import {
  Platform,
  ActionSheetController,
  LoadingController,
  IonicPage,
  NavController,
  NavParams,
  Slides
} from "ionic-angular";

import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from "@angular/forms";

import {
  CameraProvider
} from "../../providers/camera/camera";

import {
  RegisterProvider
} from '../../providers/register/register';


/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-register",
  templateUrl: "register.html"
})
export class RegisterPage {
  @ViewChild(Slides) slides: Slides;

  public currentIndex = 0;

  communityForm: FormGroup;
  chosenPicture: any;
  communityPhoto: any;
  userPhoto: any;
  public errorCommunity = "";
  public nameComm = "";
  public queryTextCom = "";
  public emptyField = "";

  constructor(
    public navCtrl: NavController,
    public cameraProvider: CameraProvider,
    public navParams: NavParams,
    public actionsheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public registerProvider: RegisterProvider,
    public formBuilder: FormBuilder
  ) {

    this.communityForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      commName: ["", Validators.compose([Validators.required])],
      firstName: ["", Validators.compose([Validators.required])],
      lastName: ["", Validators.compose([Validators.required])],
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad RegisterPage");
  }

  commNameChange () {
    
    if (this.queryTextCom != "") {
      this.emptyField = "" 
    }

    this.nameComm != this.queryTextCom ? this.errorCommunity = ""
    : this.nameComm === this.queryTextCom  && this.nameComm != "" ? this.errorCommunity = "Ce nom exist!" : ""
  }

  nextSlide(value) {
    this.currentIndex = this.slides.getActiveIndex();
    this.communityPhoto = this.chosenPicture;
    this.nameComm = value.commName;

    // emptyField
    if (this.queryTextCom == "") {
        this.emptyField = "Ce champs doit etere rempli!"
    } else {
      this.registerProvider.checkCommunityIfExist(value.commName)
      .subscribe(data => {
        if (data.count === 0) {
          this.slides.slideTo(this.currentIndex + 1);
        } else {
          this.errorCommunity = "Ce nom exist!"
        }
      });
    }
  }

  userInfoSubmit(value) {
    this.userPhoto = this.chosenPicture;
    this.registerProvider.registerNewUserCommunity(value, this.userPhoto, this.communityPhoto);
  }

  backSlide() {
    this.currentIndex = this.slides.getActiveIndex();
    this.slides.slideTo(this.currentIndex - 1);
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
}
