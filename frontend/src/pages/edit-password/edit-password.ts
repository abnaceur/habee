import { Component } from "@angular/core";
import {
  ViewController,
  IonicPage,
  NavController,
  NavParams
} from "ionic-angular";

import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from "@angular/forms";

import { environment as ENV } from "../../environments/environment";

import { UtilsProvider } from "../../providers/utils/utils";

import { PasswordProvider } from "../../providers/password/password";

/**
 * Generated class for the EditPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-edit-password",
  templateUrl: "edit-password.html"
})
export class EditPasswordPage {
  modifyPasswordForm: FormGroup;
  public url = ENV.BASE_URL;
  private tabParams: Object;
  public showPasswordText = true;
  public passwordType = "password";

  constructor(
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private utils: UtilsProvider,
    private pswService: PasswordProvider
  ) {
    this.modifyPasswordForm = formBuilder.group({
      oldPassword: ["", Validators.compose([Validators.required])],
      newPassword: [
        "",
        Validators.compose([Validators.required, Validators.minLength(8)])
      ],
      confirmPassword: ["", Validators.compose([Validators.required])]
    });

    this.tabParams = {
      userId: this.navParams.get("userId"),
      token: this.navParams.get("token"),
      activeCommunity: this.navParams.get("activeCommunity"),
      notificationStatus: this.navParams.get("notificationStatus")
    };
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  onSubmit(values) {
    if (values.newPassword != values.confirmPassword)
      this.utils.notification("Nouveaux mot de passe sont differents", "top");
    else {
      this.pswService
        .checkPasswords(values.oldPassword, this.tabParams)
        .subscribe(code => {
          if (code === 200) {
            this.pswService
              .updatePassword(values.newPassword, this.tabParams)
              .subscribe(code => {
                if (code === 200)
                  this.utils.notification(
                    "Votre mot de passe est mise a jour.",
                    "top"
                  );
                else this.utils.notification("Une erreur est survenu!", "top");
              });
          } else this.utils.notification("Mauvais mot de passe.", "top");
        });
    }
  }

  switchVisible() {
    this.showPasswordText = !this.showPasswordText;
    this.showPasswordText == false
      ? (this.passwordType = "text")
      : (this.passwordType = "password");
  }
}
