import { 
  Component 
} from '@angular/core';

import { 
  ModalController,
  IonicPage, 
  NavController, 
  NavParams } from 'ionic-angular';

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
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    ) {

      this.tabParams = {
        userId: this.navParams.get("userId"),
        token: this.navParams.get("token"),
        activeCommunity: this.navParams.get('activeCommunity')
      };

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GoodPlansPage');
  }

  modifyProfileModal() {
    const modal = this.modalCtrl.create('EditProfilePage', this.tabParams);
		modal.onDidDismiss(data => console.log("test this"));
		modal.present();
  }

}
