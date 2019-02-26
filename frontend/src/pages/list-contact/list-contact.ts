import { Component } from "@angular/core";

import {
  IonicPage,
  NavController,
  ModalController,
  ToastController,
  NavParams
} from "ionic-angular";

import {
 AddContactProvider
} from "../../providers/add-contact/add-contact"

import { InvitationProvider } from "../../providers/invitation/invitation";

import { environment as ENV } from "../../environments/environment";

import { UserProvider } from "../../providers/user/user";

import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';

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
  options: BarcodeScannerOptions;

  // Moadal declaration
  expanded: any;
  contracted: any;
  showIcon = true;
  preload = true;

  constructor(
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

    this.userProvider
      .getAllUserByCommunityId(this.tabParams)
      .subscribe(response => {
        console.log("Contact : ", response.users)
        this.contact = response.users;
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

  scanBrCode() {
    this.options = {
      prompt: "Scanner le codebare"
    }

    this.barcodeScanner.scan(this.options).then(barcodeData => {
      let email = [];
      email.push({ 'value': barcodeData.text, 'check': '', 'status': ""})
      this.addContactProvider.isFieldEmpty(email, this.tabParams)
      .then(data => {
        console.log("invitation sent :", data);
      })
    }, (err) => {
      console.log("eee ; ", err)
    });
  }

  getUserEmail() {
    let email = "";
    this.contact.map(cn => {
      if (cn.userId == this.tabParams.userId)
        email = cn.userEmail
    })
    return email
  }

  encodeData() {
    let encodText = this.getUserEmail();

    this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE, encodText)
    .then(data => {
      console.log("Encoded with success!")
    }, err => {
      console.log("Error : ", err)
    })
  }

}
