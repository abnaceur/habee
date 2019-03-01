import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

import { UtilsProvider } from "../../providers/utils/utils";

import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from "@angular/forms";

import { Http } from "@angular/http";

import {
PasswordProvider
} from "../../providers/password/password"

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-forgot-password",
  templateUrl: "forgot-password.html"
})
export class ForgotPasswordPage {
  emailForm: FormGroup;

  constructor(
    private utils: UtilsProvider,
    private pwdService: PasswordProvider,
    public http: Http,
    public nav: NavController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder
  ) {
    this.emailForm = formBuilder.group({
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ])
      ],
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ForgotPasswordPage");
  }


  clickReset() {
    document.getElementById("submitReset").click();
  }

  onSubmit(value) {
    this.pwdService.resetPassword(value.email)
    .subscribe(data => {
      if (data == 200) {
        this.utils.notification("Email de re-initialisation est envoyer", "top")
      } else if (data == 404) {
        this.utils.notification("Cet email n'exist pas!", "top")   
      } else this.utils.notification("Une erreur est survenu!", "top")
    })    
  }
}
