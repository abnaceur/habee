import { 
  Component 
} from '@angular/core';

import { 
  ModalController,
  IonicPage, 
  NavController, 
  NavParams } from 'ionic-angular';


  import {
    UtilsProvider
  } from "../../providers/utils/utils"


  import { 
    AccountProvider
  } from "../../providers/account/account"

/**
 * Generated class for the GoodPlansPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-good-plans',
  templateUrl: 'good-plans.html',
})
export class GoodPlansPage {
  private tabParams;
  public notifStatus: Boolean;

  constructor(
    private accountProvider: AccountProvider,
    private utils: UtilsProvider,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    ) {

      this.tabParams = {
        userId: this.navParams.get("userId"),
        token: this.navParams.get("token"),
        activeCommunity: this.navParams.get('activeCommunity'),
        notificationStatus: this.navParams.get("notificationStatus")
      };
  }

  ionViewWillEnter() {
    this.accountProvider.getUserNotificationStatus(this.tabParams)
    .subscribe(notifStatus => {
      this.notifStatus = notifStatus
    })
  }

  executeModal(page) {
    const modal = this.modalCtrl.create(page, this.tabParams, { cssClass: '' });
		modal.onDidDismiss(data => {
      data = [];
    });
		modal.present();
  }

  modifyProfileModal() {
    const modal = this.modalCtrl.create("EditProfilePage", this.tabParams);
		modal.present();
  }

  modifyPasswordModal() {
    this.executeModal("EditPasswordPage");
  }

  deletemyAccount() {
    this.executeModal("DeleteMyAccountPage");
  }

  modifyAccountModal() {
    const modal = this.modalCtrl.create("EditAccountPage", this.tabParams);
		modal.present();
  }

  updateNotificationStatus () {
    this.accountProvider.updateNotifiacationStatus(this.tabParams, this.notifStatus)
    .subscribe(data => {
      if (data != 200) {
        this.utils.notification("Un problem est survenu", "bottomn");
      } 
    })
  }
  
}
