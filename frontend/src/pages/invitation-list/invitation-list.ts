import {
  Component
} from '@angular/core';

import {
  IonicPage,
  NavController,
  ModalController,
  ViewController,
  ToastController,
  NavParams
} from 'ionic-angular';

import {
  environment as ENV
} from '../../environments/environment';



/**
 * Generated class for the InvitationListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-invitation-list',
  templateUrl: 'invitation-list.html',
})
export class InvitationListPage {
  public url = ENV.BASE_URL;
  public tabParams;
 
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    private toastController: ToastController,
   ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InvitationListPage');
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }

}
