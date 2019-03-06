import { Component } from "@angular/core";

import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  MenuController,
  Events
} from "ionic-angular";

import { UtilsProvider } from "../../providers/utils/utils";

import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from "@angular/forms";

import { Http } from "@angular/http";

import "rxjs/add/operator/map";

import { LoginProvider } from "../../providers/login/login";

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  authForm: FormGroup;
  public createAccount = false;

  constructor(
    private utils: UtilsProvider,
    public events: Events,
    private toastController: ToastController,
    public loginProvider: LoginProvider,
    public http: Http,
    public nav: NavController,
    public navCtrl: NavController,
    public menu: MenuController,
    public navParams: NavParams,
    public formBuilder: FormBuilder
  ) {
    this.nav = nav;

    this.menu.enable(false, "left");

    this.authForm = formBuilder.group({
      firstname: [""],
      lastname: [""],
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ])
      ],
      password: [
        "",
        Validators.compose([Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'), Validators.minLength(8)])
      ],
      confPass: [""],
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
            this.nav.push("HabeeWalkthroughPage", response);
          } else {
            this.events.publish("user:info", response);
            this.nav.push("TabsPage", response);
          }
        } else
          this.utils.notification("E-mail et/ou mot de pass non valid", "top");
      });
  }

  createUserAccount(value) {
    if (value.confPass != value.password)
      this.utils.notification("Password/confirmation n'est pas correct", "top");
    else {
      this.loginProvider.createANewAccount(value).subscribe(data => {
        if (data.code === 201) this.utils.notification("Email exist !", "top");
        else if (data.code == 200)
          this.utils.notification("Compte cree avec succes", "top");
        else this.utils.notification("Une erreur est survenu", "top");
      });
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
    this.navCtrl.push("ForgotPasswordPage")
  }
}
