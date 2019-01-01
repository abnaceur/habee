import {
  Component
} from '@angular/core';

import {
  IonicPage,
  NavController,
  ModalController,
  ToastController,
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


  // Moadal declaration 
  expanded: any;
  contracted: any;
  showIcon = true;
  preload = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private userProvider: UserProvider,
    private toastController: ToastController,
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

  expand() {
    this.expanded = true;
    this.contracted = !this.expanded;
    this.showIcon = false;

      console.log("Add contact");
      setTimeout(() => {
        const modal = this.modalCtrl.create('AddContactPage', this.tabParams);
        modal.onDidDismiss(data => {
          this.expanded = false;
          this.contracted = !this.expanded;
          setTimeout(() => this.showIcon = true, 330);
        });
        modal.present();
      }, 200);
    }
}
