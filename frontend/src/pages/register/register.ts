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

import { CameraProvider } from "../../providers/camera/camera";

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

  constructor(
    public navCtrl: NavController,
    public cameraProvider: CameraProvider,
    public navParams: NavParams,
    public actionsheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public formBuilder: FormBuilder
  ) {
    this.communityForm = formBuilder.group({
      commName: ["", Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad RegisterPage");
  }

  nextSlide(value) {
    this.currentIndex = this.slides.getActiveIndex();
    console.log("Current index is", this.currentIndex);
    this.slides.slideTo(this.currentIndex + 1);
    console.log("Com value :", value, this.chosenPicture);
  }

  backSlide() {
    this.currentIndex = this.slides.getActiveIndex();
    console.log("Current index is", this.currentIndex);
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
