import { Component, ContentChild } from "@angular/core";

import {
  IonicPage,
  NavController,
  ModalController,
  ViewController,
  ToastController,
  NavParams,
  LoadingController
} from "ionic-angular";

import moment from "moment";

import { UtilsProvider } from "../../providers/utils/utils";

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

  public listCommunity;
  public contact;
  public notificationCount = 0;

  page = 0;
  perPage = 0;
  totalData = 0;
  totalPage = 0;


  // Moadal declaration
  expanded: any;
  contracted: any;
  showIcon = true;
  preload = true;

  public invitationList: any;

  constructor(
    private utils: UtilsProvider,
    private invitationProvider: InvitationProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    private loadingCTRL: LoadingController,
    private toastController: ToastController
  ) {
    this.tabParams = {
      userId: this.navParams.get("userId"),
      token: this.navParams.get("token"),
      activeCommunity: this.navParams.get("activeCommunity"),
      countNotification: this.navParams.get("countNotification"),
    };
  }


  getListContact() {
    this.invitationProvider
      .getAllUserInvitations(this.tabParams, this.page)
      .subscribe(response => {
        this.invitationList = response.invitations;
        this.perPage = response.per_page;
        this.totalData = response.total;
        this.totalPage = response.total_pages;
      });
  }

  ionViewWillEnter() {
    let loader = this.loadingCTRL.create({
      spinner: 'dots',
    });
    loader.present();
    this.getListContact();
    loader.dismiss();
  }

  getCountinvitation() {
    this.invitationProvider
      .getCountNotification(this.tabParams)
      .subscribe(count => {
        setTimeout(() => {
          // this.notificationCount = count;
          // localStorage.setItem("invitNotif", count)
        }, 500);
      });
  }

  ionViewDidEnter() {
    this.getCountinvitation();
  }

  expand() {
    this.expanded = true;
    this.contracted = !this.expanded;
    this.showIcon = false;

    const modal = this.modalCtrl.create("AddContactPage", this.tabParams);
    modal.onDidDismiss(data => {
      this.expanded = false;
      this.contracted = !this.expanded;
      this.page = 0;
      this.getListContact();
      this.selectInvitationList();
      setTimeout(() => (this.showIcon = true), 330);
    });
    modal.present();
  }


  selectInvitationList() {
    if (this.tabParams.countNotification != 0) {
      this.invitationProvider
        .updateNotification(this.tabParams)
        .subscribe(data => {
          this.notificationCount = 0;
        });
    }
  }

  doInfinite(infiniteScroll) {
    this.page = this.page + 1;
    setTimeout(() => {
      this.invitationProvider
        .getAllUserInvitations(this.tabParams, this.page)
        .subscribe(response => {
          this.invitationList = this.invitationList.concat(response.invitations);
          this.perPage = response.per_page;
          this.totalData = response.total;
          this.totalPage = response.total_pages;
        });
      console.log("Async operation has ended");
      infiniteScroll.complete();
    }, 1000);
  }

  ionViewWillLeave() {
    this.page = 0;
  }

  acceptInvitation(invit) {
    this.invitationProvider
      .acceptedInvitatioo(invit, this.tabParams)
      .subscribe(data => {
        if (data == 200) {
          this.page = 0;
          this.getListContact();
          this.utils.notification(
            "Adhesion prise en compte",
            "top"
          );
        } else {
          this.utils.notification("Sorry, something went wrong!", "top");
        }
      });
  }

  rejectInvitation(invit) {
    this.invitationProvider
      .rejectedInvitation(invit, this.tabParams)
      .subscribe(data => {
        if (data == 200) {
          this.page = 0;
          this.getListContact();
          this.utils.notification("Annulation envoyée", "top");
        } else {
          this.utils.notification("Sorry, something went wrong!", "top");
        }
      });
  }

  transform(value) {
    moment.locale("fr");
    let a = moment(value).fromNow();
    return a;
  }


  resendInvitation(invit) {
    this.invitationProvider.resendInvitation(this.tabParams, invit)
      .subscribe(data => {
        if (data == 200) {
          this.utils.notification("Invitation viens d'etre re-envoyer !", "top");
          this.page = 0;
          this.getListContact();
        }
        else
          this.utils.notification("Desole, une erreur est survenu !", "top");
      })
  }

  cancelInviatation(invit) {
    this.invitationProvider.cancelInvitation(this.tabParams, invit)
      .subscribe(data => {
        if (data == 200) {
          this.utils.notification("Invitation viens d'etre annuler !", "top");
          this.page = 0;
          this.getListContact();
        }
        else
          this.utils.notification("Desole, une erreur est survenu !", "top");
      })
  }

}
