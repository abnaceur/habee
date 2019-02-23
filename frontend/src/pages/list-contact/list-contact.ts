import { Component } from "@angular/core";

import {
  IonicPage,
  NavController,
  ModalController,
  ToastController,
  NavParams
} from "ionic-angular";

import { InvitationProvider } from "../../providers/invitation/invitation";

import { environment as ENV } from "../../environments/environment";

import { UserProvider } from "../../providers/user/user";

/**
 * Generated class for the ListContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-list-contact",
  templateUrl: "list-contact.html"
})
export class ListContactPage {
  public url = ENV.BASE_URL;
  public contact;
  public tabParams;
  public notificationCount = 0;

  // Moadal declaration
  expanded: any;
  contracted: any;
  showIcon = true;
  preload = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private invitationProvider: InvitationProvider,
    public modalCtrl: ModalController,
    private userProvider: UserProvider,
    private toastController: ToastController
  ) {
    this.tabParams = {
      userId: this.navParams.get("userId"),
      token: this.navParams.get("token"),
      activeCommunity: this.navParams.get("activeCommunity")
    };
  }

  ionViewDidEnter() {
    this.invitationProvider
    .getCountNotification(this.tabParams)
    .subscribe(count => {
      setTimeout(() => {
        this.notificationCount = count
      }, 500)
    })

    console.log("ionViewDidLoad ListContactPage", this.notificationCount);
    this.userProvider
      .getAllUserByCommunityId(this.tabParams)
      .subscribe(response => {
        this.contact = response.users;
        console.log("Repsonse this list contact : ", response);
      });
  }

  expand() {
    this.expanded = true;
    this.contracted = !this.expanded;
    this.showIcon = false;

      const modal = this.modalCtrl.create("AddContactPage", this.tabParams);
      modal.onDidDismiss(data => {
        this.expanded = false;
        this.contracted = !this.expanded;
        setTimeout(() => (this.showIcon = true), 330);
      });
      modal.present();
  }

  openInvitationsList() {
    this.tabParams.countNotification = this.notificationCount
    const modal = this.modalCtrl.create("InvitationListPage", this.tabParams);
    modal.onDidDismiss(data => {
      this.notificationCount = 0;
    });
    modal.present();
  }
}
