import { 
  Component } from '@angular/core';

  import { 
    ViewController,
    IonicPage, 
    NavController, 
    NavParams } from 'ionic-angular';

/**
 * Generated class for the DeleteMyAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-delete-my-account',
  templateUrl: 'delete-my-account.html',
})
export class DeleteMyAccountPage {

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController, 
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeleteMyAccountPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
