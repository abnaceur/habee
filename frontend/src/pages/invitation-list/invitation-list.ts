import { Component } from "@angular/core";

import {
  IonicPage,
  NavController,
  ModalController,
  ViewController,
  ToastController,
  NavParams
} from "ionic-angular";

import { environment as ENV } from "../../environments/environment";

import {
  InvitationProvider
} from '../../providers/invitation/invitation'

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
      activeCommunity: this.navParams.get("activeCommunity")
    };
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad InvitationListPage");
  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter InvitationListPage");
    this.invitationProvider.getAllUserInvitations(this.tabParams)
    .subscribe(data => {
      console.log("Data : ", data);
      this.invitationList = data;
    })

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
