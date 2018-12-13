import {
  Component
} from '@angular/core';

import {
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';

import {
	environment as ENV
} from '../../environments/environment';

import {
	UserProvider
} from '../../providers/user/user';



/**
 * Generated class for the ListContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list-contact',
  templateUrl: 'list-contact.html',
})


export class ListContactPage {

  public url = ENV.BASE_URL;

  public contact;

  public tabParams;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userProvider: UserProvider,
  ) {
    this.tabParams = {
      userId: this.navParams.get("userId"),
      token: this.navParams.get("token"),
      activeCommunity: this.navParams.get('activeCommunity')
    };
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad ListContactPage', this.tabParams);
    this.userProvider.getAllUserByCommunityId(this.tabParams)
    .subscribe(response => {
      this.contact = response.users;
        console.log("Repsonse this list contact : ", response)
    });
  }



}
