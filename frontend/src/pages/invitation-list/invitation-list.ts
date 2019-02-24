import { Component } from "@angular/core";

import {
  IonicPage,
  NavController,
  ModalController,
  ViewController,
  ToastController,
  NavParams
} from "ionic-angular";

import {
  UtilsProvider
} from '../../providers/utils/utils'

import { environment as ENV } from "../../environments/environment";

import { InvitationProvider } from "../../providers/invitation/invitation";

/**
 * Generated class for the InvitationListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-invitation-list",
  templateUrl: "invitation-list.html"
})
export class InvitationListPage {
  public url = ENV.BASE_URL;
  public tabParams;
  public invitationList: any;

  constructor(
    private utils: UtilsProvider,
    private invitationProvider: InvitationProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    private toastController: ToastController
  ) {
    this.tabParams = {
      userId: this.navParams.get("userId"),
      token: this.navParams.get("token"),
      activeCommunity: this.navParams.get("activeCommunity"),
      countNotification: this.navParams.get("countNotification")
    };
  }

  ionViewDidEnter() {
    this.invitationProvider
      .getAllUserInvitations(this.tabParams)
      .subscribe(data => {
        this.invitationList = data;
      });
  }

  dismiss() {
    if (this.tabParams.countNotification != 0) {
      this.invitationProvider
        .updateNotification(this.tabParams)
        .subscribe(data => {
          this.viewCtrl.dismiss();
        });
    } else this.viewCtrl.dismiss();
  }

  acceptInvitation(invit) {
    this.invitationProvider
      .acceptedInvitatioo(invit, this.tabParams)
      .subscribe(data => {
        console.log("Here data :", data);
        if (data == 200) {
          this.invitationProvider
            .getAllUserInvitations(this.tabParams)
            .subscribe(data => {
              this.invitationList = data;
            });
        } else {
          this.utils.notification("Sorry, something went wrong!", "top");
        }
      });
  }
}
