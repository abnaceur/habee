import { Component } from "@angular/core";

import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  MenuController,
  ModalController,
  Events
} from "ionic-angular";

import { UtilsProvider } from "../../providers/utils/utils";
import { Storage } from '@ionic/storage';

import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from "@angular/forms";

import { Http } from "@angular/http";

import "rxjs/add/operator/map";

import { LoginProvider } from "../../providers/login/login";
import { calcBindingFlags } from "@angular/core/src/view/util";

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  authForm: FormGroup;
  public createAccount = false;
  public showPasswordText = true;
  public passwordType = "password"
  public tabParams;
  public validatePasswords = "";

  public requireFirstname = false;
  public requireLastname = false;

  constructor(
    private storage: Storage,
    private utils: UtilsProvider,
    public events: Events,
    private toastController: ToastController,
    public loginProvider: LoginProvider,
    public http: Http,
    public nav: NavController,
    public navCtrl: NavController,
    public menu: MenuController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public formBuilder: FormBuilder
  ) {
    this.tabParams = this.navParams.get("logout");
    if (this.tabParams === true) {
      this.storage.set('response', null);
      this.storage.remove('response')
        .then(resp => console.log("Response removerd"))
        .catch(err => console.log("error storage !"));
      this.storage.clear();
    }
    this.nav = nav;
    this.menu.enable(false, "left");
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

  loginUserToSession(value) {
    this.loginProvider
      .loginUser(value.email, value.password)
      .subscribe(response => {
        if (response.code == "200") {
          if (response.firstConnection == 0) {
            this.events.publish("user:info", response);
            this.loginProvider
              .updateUserNbrConnection(response.token, response.userId)
              .subscribe(response => response);
            this.storage.remove('response')
              .then(resp => console.log("Response removerd"))
              .catch(err => console.log("error storage !"));
            this.storage.clear();
            this.storage.set('response', response);
            this.events.publish("user:info", response);
            console.log("Resposne new account :", response);
            this.nav.push("HabeeWalkthroughPage", response);
          } else {
            this.storage.remove('response')
              .then(resp => console.log("Response removerd"))
              .catch(err => console.log("error storage !"));
            this.storage.clear();
            this.storage.set('response', response);
            this.events.publish("user:info", response);
            console.log("Resposne login :", response);
            this.nav.push("TabsPage", response);
          }
        } else
          this.utils.notification("E-mail et/ou mot de pass non valid", "top");
      });
  }

  hideValidationPasswordError() {
    this.validatePasswords = "";
  }

  createUserAccount(value) {
    let check = 0

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

  onSubmit(value: any): void {
    if (this.createAccount === false) this.loginUserToSession(value);
    else if (this.createAccount === true) this.createUserAccount(value);
  }

  loginUser() {
    document.getElementById("submitLogin").click();
  }

  showInscription() {
    this.createAccount = true;
  }

  resetPassword() {
    this.navCtrl.push("ForgotPasswordPage");
  }

  showPassword() {
    this.showPasswordText = !this.showPasswordText;

    if (this.showPasswordText) {
      this.passwordType = 'password';
    } else {
      this.passwordType = 'text';
    }
  }
}
