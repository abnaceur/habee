import { 
  Component 
} from '@angular/core';

import { 
  IonicPage,
   NavController, 
   ViewController,
   NavParams 
  } from 'ionic-angular';

/**
 * Generated class for the EventFilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-filter',
  templateUrl: 'event-filter.html',
})
export class EventFilterPage {
  public trueValue = true;

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController, 
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventFilterPage');
  }

  closeFilterModal() {
      this.viewCtrl.dismiss();  
  }
}
