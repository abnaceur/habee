import { Component, ViewChild } from "@angular/core";

import {
  Platform,
  ActionSheetController,
  IonicPage,
  NavController,
  NavParams,
  Slides,
  ModalController,
  Events
} from "ionic-angular";

import { Storage } from '@ionic/storage';

import { UtilsProvider } from "../../providers/utils/utils";

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

import { LoginProvider } from "../../providers/login/login";

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


  authForm: FormGroup;
  public showPasswordText = true;
  public passwordType = "password"
  public tabParams;
  public validatePasswords = "";

  public requireFirstname = false;
  public requireLastname = false;

  constructor(
    private utils: UtilsProvider,
    private storage: Storage,
    public navCtrl: NavController,
    public events: Events,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public nav: NavController,
    public platform: Platform,
    public registerProvider: RegisterProvider,
    public formBuilder: FormBuilder,
    public loginProvider: LoginProvider,
  ) {

    this.authForm = formBuilder.group({
        firstname: [""],
        lastname: [""],
        email: [
          "",
          Validators.compose([
            Validators.required,
            Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')
          ])
        ],
        password: [
          "",
          Validators.compose([
            Validators.required,
            // Validators.pattern(
            //   "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
            // ),
            Validators.minLength(8)
          ])
        ],
        confPass: [""]
      });
  }

  createUserAccount(value) {
    let check = 0
    console.log("here222")

    if (value.lastname === "") {
      check = 1;
      this.requireLastname = true;
    } else check = 0;

    if (value.firstname === "") {
      check = 1;
      this.requireFirstname = true;
    } else check = 0;

    if (check === 0) {
      if (value.confPass != value.password)
        this.validatePasswords = "Votre mot de passe n'est pas correct";
      else {
        const modal = this.modalCtrl.create("TermsOfServicePage", "", { cssClass: "" });
        modal.onDidDismiss(data => {
          if (data == true) {
            this.loginProvider.createANewAccount(value).subscribe(data => {
              if (data.code === 201)
                this.utils.notification("Email exist !", "top");
              else if (data.code == 200) {
                this.utils.notification("Compte créé avec succès !", "top");
                this.loginUserToSession(value);
              }
              else this.utils.notification("Une erreur est survenu", "top");
            });
          }
        });
        modal.present();
      }
    }
  }

  loginUserToSession(value) {
    this.loginProvider
      .loginUser(value.email, value.password)
      .subscribe(response => {
        if (response.code == "200") {
          if (response.firstConnection == 0) {
            this.events.publish("user:info", response);
            this.loginProvider
              .updateUserNbrConnection(response.token, response.userId)
              .subscribe(result => result);
            this.storage.remove('response')
              .then(resp => {
                console.log("Response removed ");
                this.storage.set('response', response);
                this.events.publish("user:info", response);
                console.log("Resposne new account :", response);
                this.nav.push("HabeeWalkthroughPage", response);
              })
              .catch(err => console.log("error storage !"));
            this.storage.clear();
          } else {
            this.storage.remove('response')
              .then(resp => { 
                console.log("Response removerd")
                this.storage.clear();
                this.storage.set('response', response);
                this.events.publish("user:info", response);
                console.log("Resposne login :", response);
                this.nav.push("TabsPage", response);
              })
              .catch(err => console.log("error storage !"));
          }
        } else
          this.utils.notification("E-mail et/ou mot de pass non valid", "top");
      });
  }

  onSubmit(value: any): void {
    console.log("here sub,kit")

    this.createUserAccount(value);
  }

  showPassword() {
    this.showPasswordText = !this.showPasswordText;

    if (this.showPasswordText) {
      this.passwordType = 'password';
    } else {
      this.passwordType = 'text';
    }
  }

  goTologinPage() {
    this.navCtrl.push("LoginPage");
  }

  hideValidationPasswordError() {
    this.validatePasswords = "";
  }
}
