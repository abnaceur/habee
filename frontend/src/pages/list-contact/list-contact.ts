import { Component } from "@angular/core";

import {
  IonicPage,
  NavController,
  ModalController,
  ToastController,
  LoadingController,
  NavParams,
  PopoverController
} from "ionic-angular";

import moment from "moment";

import { AddContactProvider } from "../../providers/add-contact/add-contact";

import { UtilsProvider } from "../../providers/utils/utils";

import { CommunityProvider } from "../../providers/community/community";

import { InvitationProvider } from "../../providers/invitation/invitation";

import { environment as ENV } from "../../environments/environment";

import { UserProvider } from "../../providers/user/user";

import {
  BarcodeScanner,
  BarcodeScannerOptions
} from "@ionic-native/barcode-scanner";
import { c } from "@angular/core/src/render3";
import { Subscriber } from "rxjs/Subscriber";

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
  allCommunities = [];
  public url = ENV.BASE_URL;
  public listCommunity; 
  public contact;
  public tabParams;
  public notificationCount = 0;
  options: BarcodeScannerOptions;

  page = 0;
  perPage = 0;
  totalData = 0;
  totalPage = 0;

  public myContactBorder = "5px solid darkgrey";
  public myContactBorderDisplay = "initial";
  public listInvitBorder = "";
  public listInvitBorderDisplay = "none";

  // Moadal declaration
  expanded: any;
  contracted: any;
  showIcon = true;
  preload = true;

  public invitationList: any;

  constructor(
    private communityProvider: CommunityProvider,
    public popoverCtrl: PopoverController,
    private utils: UtilsProvider,
    private loadingCTRL: LoadingController,
    private addContactProvider: AddContactProvider,
    private barcodeScanner: BarcodeScanner,
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
      activeCommunity: this.navParams.get("activeCommunity"),
      notificationStatus: this.navParams.get("notificationStatus")
    };

  }

  getAllUserContacts() {
    if (this.tabParams.activeCommunity != "") {
      this.communityProvider
        .getCommunitiesbyCreator(this.tabParams)
        .subscribe(dataCreator => {
          this.tabParams.page = this.page;
          this.allCommunities = dataCreator.communities;
          this.userProvider
            .getAllUserByCommunityId(this.tabParams, this.allCommunities)
            .subscribe(response => {
              this.contact = response.users;
            });
        });
    }
  }

  getListContact() {
    this.invitationProvider
      .getAllUserInvitations(this.tabParams, this.page)
      .subscribe(data => {
        this.invitationList = data;
      });
  }

  ionViewWillEnter() {
    let loader = this.loadingCTRL.create({
      spinner: 'dots',
    });
    loader.present();
    this.getAllUserContacts();
    //this.getListContact();
    loader.dismiss();
  }

  getCountinvitation() {
    this.invitationProvider
      .getCountNotification(this.tabParams)
      .subscribe(count => {
        setTimeout(() => {
        //  this.notificationCount = count;
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
      this.getListContact();
      this.selectInvitationList();
      setTimeout(() => (this.showIcon = true), 330);
    });
    modal.present();
  }

  openInvitationsList() {
    this.tabParams.countNotification = this.notificationCount;
    const modal = this.modalCtrl.create("InvitationListPage", this.tabParams);
    modal.onDidDismiss(data => {
      this.notificationCount = 0;
    });
    modal.present();
  }

  scanBrCode() {
    this.options = {
      prompt: "Scanner le codebare",
      showFlipCameraButton: false,
      showTorchButton: false,
      resultDisplayDuration: 0
    };

    this.barcodeScanner.scan(this.options).then(
      barcodeData => {
        let email = [];
        let data = [];
        email = barcodeData.text.split(';')

        let i = 1;
        let coms = [];
        while (i < email.length) {
          coms.push(email[i]);
          i++;
        }

        coms.pop()
        data.push({ value: email[0], check: "", status: "", communities: coms });
        if (email[0] != "") {
          this.addContactProvider
            .getQrCodeInvitation(data, this.tabParams)
            .then(data => {
              if (data[0].status == 200)
                this.utils.notification(
                  "Invitation bien reçue",
                  "top"
                );
              else if (data[0].status == 500 && data[0].check == "")
                this.utils.notification("Ce compte exist!", "top");
              //TODO ADD BACK BUTTON TO THE BARECODE SCANNER
              if (data[0].check != "") {
                this.utils.notification(data[0].check, "top");
              }
            });
        }
      },
      err => {
        console.log("Error ; ", err);
      }
    );
  }

  getUserEmail() {
    let email = "";
    this.contact.map(cn => {
      if (cn.userId == this.tabParams.userId) email = cn.userEmail;
    });
    return email;
  }

  encodeData() {
    let email = this.getUserEmail();

    const modal = this.modalCtrl.create(
      "CommunityEventListPage",
      this.tabParams,
      { cssClass: "comEvent-modal" }
    );
    modal.onDidDismiss(data => {
      if (data.length == 0) this.listCommunity.push(this.tabParams.activeCommunity);
      else if (data.length > 0) this.listCommunity = data;

      let coms = '';
      this.listCommunity.map(cc => {
        coms += cc + ";"
      })

      let encodText = email + ";" + coms

      this.barcodeScanner
        .encode(this.barcodeScanner.Encode.TEXT_TYPE, encodText)
        .then(
          data => {
            console.log("data :", data);
            console.log("Encoded with success!");
          },
          err => {
            console.log("Error : ", err);
          }
        );
    });
    modal.present();
  }

  selectContactList() {
    this.myContactBorder = "5px solid darkgrey";
    this.myContactBorderDisplay = "initial";
    this.listInvitBorder = "";
    this.listInvitBorderDisplay = "none";
  }

  selectInvitationList() {
    if (this.tabParams.countNotification != 0) {
      this.invitationProvider
        .updateNotification(this.tabParams)
        .subscribe(data => {
          this.notificationCount = 0;
        });
    }
    this.myContactBorder = "";
    this.myContactBorderDisplay = "none";
    this.listInvitBorder = "5px solid darkgrey";
    this.listInvitBorderDisplay = "initial";
  }

  doInfinite(infiniteScroll) {
    this.page = this.page + 1;

    setTimeout(() => {
      if (this.tabParams.activeCommunity != "") {
        this.communityProvider
          .getCommunitiesbyCreator(this.tabParams)
          .subscribe(dataCreator => {
            this.communityProvider
              .getCommunitiesByParticipation(this.tabParams)
              .subscribe(dataParticipation => {
                dataCreator.communities = dataCreator.communities.concat(
                  dataParticipation
                );
                this.allCommunities = dataCreator.communities;
                this.tabParams.page = this.page;
                this.userProvider
                  .getAllUserByCommunityId(this.tabParams, this.allCommunities)
                  .subscribe(response => {
                    this.contact = this.contact.concat(response.users);
                    this.perPage = response.per_page;
                    this.totalData = response.total;
                    this.totalPage = response.total_pages;
                  });
              });
          });
      }
      console.log("Async operation has ended");
      infiniteScroll.complete();
    }, 1000);
  }

  acceptInvitation(invit) {
    this.invitationProvider
      .acceptedInvitatioo(invit, this.tabParams)
      .subscribe(data => {
        if (data == 200) {
          this.invitationProvider
            .getAllUserInvitations(this.tabParams, this.page)
            .subscribe(data => {
              this.invitationList = data;
              this.utils.notification(
                "Adhesion prise en compte",
                "top"
              );
            });
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
          this.invitationProvider
            .getAllUserInvitations(this.tabParams, this.page)
            .subscribe(data => {
              this.invitationList = data;
              this.utils.notification("Annulation envoyée", "top");
            });
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

  async addComToContact(ev: any, userCommunities, contactInfo) {

    const popover = await this.popoverCtrl.create(
      "AddCommunityToContactPopupPage",
      {
        tabParams: this.tabParams,
        communities: userCommunities,
        contactInfo: contactInfo
      }
    );
    await popover.present({
      ev: ev
    });

    await popover.onDidDismiss(data => {
      console.log("Add community dissmissed!", data);
      this.getAllUserContacts();
      this.getListContact();
    });
  }

  async removeComFromContact(ev: any, userCommunities, contactInfo) {
    const popover = await this.popoverCtrl.create(
      "RemoveCommunityFromContactPopupPage",
      {
        tabParams: this.tabParams,
        communities: userCommunities,
        contactInfo: contactInfo
      }
    );
    await popover.present({
      ev: ev
    });

    await popover.onDidDismiss(data => {
      console.log("Remove community dissmissed!", data);
      this.getAllUserContacts();
      this.getListContact();
    });
  }

  resendInvitation(invit) {
    this.invitationProvider.resendInvitation(this.tabParams, invit)
      .subscribe(data => {
        if (data == 200) {
          this.utils.notification("Invitation viens d'etre re-envoyer !", "top");
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
          this.getListContact();
        }
        else
          this.utils.notification("Desole, une erreur est survenu !", "top");
      })
  }

}