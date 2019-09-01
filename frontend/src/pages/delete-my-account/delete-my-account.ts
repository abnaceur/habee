import { Component, ViewChild } from "@angular/core";

import {
  ViewController,
  IonicPage,
  NavController,
  NavParams
} from "ionic-angular";

import { AccountProvider } from "../../providers/account/account";

import { environment as ENV } from "../../environments/environment";

import { UtilsProvider } from "../../providers/utils/utils";

import { BackgroundMode } from "@ionic-native/background-mode";
/**
 * Generated class for the DeleteMyAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-delete-my-account",
  templateUrl: "delete-my-account.html"
})
export class DeleteMyAccountPage {
  public url = ENV.BASE_URL;
  private tabParams: Object;

  constructor(
    private backgroundMode: BackgroundMode,
    private accountService: AccountProvider,
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    private utils: UtilsProvider,
    public navParams: NavParams
  ) {
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

  deleteAccount() {
    this.accountService.deleteUserAccount(this.tabParams)
    .subscribe(data => {
      if (data == 200) {
        this.utils.notification("Votre compte est bien Supprimer", "top")
        let menuData = ["Déconnexion", this.tabParams];
        this.navCtrl.push("TabsPage", menuData);
      } else if (data == 500) this.utils.notification("Une erreur est survenu", "top")
      else this.utils.notification("Une erreur est survenu", "top")
    })
  }
}
