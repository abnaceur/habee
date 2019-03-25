import { Component } from "@angular/core";

import { IonicPage, NavController, NavParams } from "ionic-angular";

import { CommunityProvider } from "../../providers/community/community";

/**
 * Generated class for the AddCommunityToContactPopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-add-community-to-contact-popup",
  templateUrl: "add-community-to-contact-popup.html"
})
export class AddCommunityToContactPopupPage {
  allCommunities = [];
  public tabParams;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private communityProvider: CommunityProvider
  ) {

    this.tabParams = {
      userId: this.navParams.get("userId"),
      token: this.navParams.get("token"),
      activeCommunity: this.navParams.get("activeCommunity"),
      notificationStatus: this.navParams.get("notificationStatus")
    };

  }

  ionViewWillEnter() {
    this.getAllCommunities()
  }

  getAllCommunities() {
    console.log("aaa === aaaa", this.tabParams)
    if (this.tabParams.activeCommunity != "") {
      this.communityProvider
        .getCommunitiesbyCreator(this.tabParams)
        .subscribe(dataCreator => {
            this.allCommunities = dataCreator.communities;
            console.log("this.allCommunities : ", this.allCommunities);
        });
    }
  }
}
