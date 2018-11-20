import { 
  Component 
} from '@angular/core';

import { 
  IonicPage, 
  NavController, 
  ViewController,
  NavParams 
} from 'ionic-angular';

import {
  environment as ENV
} from '../../../environments/environment';


/**
 * Generated class for the PopupUserDetailModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-popup-user-detail-modal',
  templateUrl: 'popup-user-detail-modal.html',
})
export class PopupUserDetailModalPage {
  public tabParams;
  imageUrl: string = 'assets/img/profile/profile-cover.jpg';
  public userProfileImage;
  public url = ENV.BASE_URL;
  public userFullname;


  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams
  ) {
    this.tabParams = this.navParams.data.userDetails
  }

  ionViewWillEnter() {
    this.userProfileImage = this.tabParams.participantPhoto;
    this.userFullname = this.tabParams.participantname;
    console.log('ionViewDidLoad PopupUserDetailModalPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
