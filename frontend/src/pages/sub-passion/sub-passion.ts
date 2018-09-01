import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SubPassionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sub-passion',
  templateUrl: 'sub-passion.html',
})
export class SubPassionPage {
  public buttonChangeColor = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubPassionPage');
  }

  public toggleButtonColor(buttonChangeColor, index): void {
    if(buttonChangeColor === 'light' || buttonChangeColor  === undefined) { 
      this.buttonChangeColor[index] = 'secondary'
    } else {
      this.buttonChangeColor[index] = 'light'
    }
  }

}
