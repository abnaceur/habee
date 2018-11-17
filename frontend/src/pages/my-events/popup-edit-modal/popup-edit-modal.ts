import {
  Component
} from '@angular/core';

import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from 'ionic-angular';
import {
  environment as ENV
} from '../../../environments/environment';

import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';
/**
 * Generated class for the PopupEditModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-popup-edit-modal',
  templateUrl: 'popup-edit-modal.html',
})
export class PopupEditModalPage {
  proposeEventForm: FormGroup;
  public eventDetails;
  public tabParams;
  public chosenPicture;
  public url = ENV.BASE_URL;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private _FB: FormBuilder,
    public viewCtrl: ViewController

  ) {

    this.proposeEventForm = formBuilder.group({
      eventTitle: ['', Validators.compose([Validators.required])],
      eventLocation: ['', Validators.compose([Validators.required])],
      eventNbrParticipants: ['', Validators.compose([Validators.required])],
      eventDescription: ['', Validators.compose([Validators.required])],
      eventStartDate: ['', Validators.compose([Validators.required])],
      eventEndDate: ['', Validators.compose([Validators.required])],
      eventStartHour: ['', Validators.compose([Validators.required])],
      eventEndHour: ['', Validators.compose([Validators.required])],
    });
    this.tabParams = this.navParams.data

  }

  ionViewWillEnter() {
    this.chosenPicture = this.url + "/" + this.tabParams.eventPhoto;

      this.proposeEventForm = this._FB.group({
        "eventTitle": [this.tabParams.eventName],
        "eventLocation": [this.tabParams.eventLocation],
        "eventNbrParticipants": [this.tabParams.nbrParticipants],
        "eventDescription": [this.tabParams.eventDescription],
      })
    
      console.log('ionViewDidLoad PopupEditModalPage', this.tabParams.eventName);
    this.eventDetails = this.tabParams
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
