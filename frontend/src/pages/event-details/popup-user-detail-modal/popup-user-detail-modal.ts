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

import {
ProfileProvider
} from '../../../providers/profile/profile'


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
  public coverImage = "assets/img/background/background-5.jpg";
  public url = ENV.BASE_URL;
  public user = {
    nbrCommunities: "",
    nbrEventsParticipated: "",
    profile: {
      profileUsername: "",
      profilePhoto: ""
    },
    eventCreated: ""
  };


  constructor(
    private profileProvider : ProfileProvider,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams
  ) {
    console.log("this.navParams : ", this.navParams.data);
    this.tabParams = this.navParams.data
  }

  ionViewWillEnter() {
    this.profileProvider
    .getUserProfileByCommunityId(this.tabParams)
    .subscribe(response => {
      this.user = response.User[0];
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
