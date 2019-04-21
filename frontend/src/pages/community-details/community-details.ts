import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  ModalController,
  NavParams
} from "ionic-angular";

import { UtilsProvider } from "../../providers/utils/utils";

import { CommunityProvider } from "../../providers/community/community";

import { environment as ENV } from "../../environments/environment";

/**
 * Generated class for the CommunityDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-community-details",
  templateUrl: "community-details.html"
})
export class CommunityDetailsPage {
  public url = ENV.BASE_URL;
  public tabParams;
  private comId;
  public community = {}

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private communityProvider: CommunityProvider,
    public modalCtrl: ModalController,
    private utils: UtilsProvider
  ) {
    this.tabParams = this.navParams.get("userInfo");
    this.comId = this.navParams.get("comId");
  }

  ionViewWillEnter() {
    this.getCommunityDetails()
  }

  getCommunityDetails() {
    this.communityProvider.getCommunityDetails(this.tabParams, this.comId)
    .subscribe(data => {
      console.log("CommunityDetailsPageModule : ", data)
      this.community = data
    })
  }

  editCommunityModal() {
    const modal = this.modalCtrl.create("EditCommunityModalPage", {
      userInfo: this.tabParams,
      selectCommunity: this.comId
    }, { cssClass: "comEdit-modal" });
    modal.onDidDismiss(data => {
      this.getCommunityDetails()
    });
    modal.present();
  }

  viewEventDetails(eventDetails) {
      this.navCtrl.push("EventDetailsPage", {
        data: eventDetails,
        userId: this.tabParams.userId,
        token: this.tabParams.token,
        activeCommunity: this.tabParams.activeCommunity
      });
  }

  openUserDetailsModal(userDetails, user) {
    console.log("userDetails :", userDetails);
    let navInfo = {
      check: 0,
      userDetails: user,
      userId: userDetails,
      token: this.tabParams.token,
      activeCommunity: this.comId
    };

    this.modalCtrl
      .create("PopupUserDetailModalPage", navInfo, { cssClass: "userShow-modal" })
      .present();
  }

}
