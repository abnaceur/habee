import { Component } from "@angular/core";
import { IonicPage, NavController, ViewController, NavParams } from "ionic-angular";

import { UtilsProvider } from "../../providers/utils/utils";

import { environment as ENV } from "../../environments/environment";

import { CommunityProvider } from "../../providers/community/community";

/**
 * Generated class for the ConatctListFilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-conatct-list-filter",
  templateUrl: "conatct-list-filter.html"
})
export class ConatctListFilterPage {
  public url = ENV.BASE_URL;
  public contact;
  public tabParams;
  public allCommunities = [];

  constructor(
    public navCtrl: NavController,
    private utils: UtilsProvider,
    private communityProvider: CommunityProvider,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    this.tabParams = {
      userId: this.navParams.get("userId"),
      token: this.navParams.get("token"),
      activeCommunity: this.navParams.get("activeCommunity"),
      notificationStatus: this.navParams.get("notificationStatus")
    };

    console.log("this.tabParams : 111 s", this.tabParams);
  }

  ionViewWillEnter() {
    this.getAllCommunities()
  }

  getAllCommunities() {
    if (this.tabParams.activeCommunity != "") {
      this.communityProvider
        .getCommunitiesbyCreator(this.tabParams)
        .subscribe(dataCreator => {
          this.communityProvider
            .getCommunitiesByParticipation(this.tabParams)
            .subscribe(dataParticipation => {
              dataCreator.communities.concat(dataParticipation);
              if (dataCreator.communities.length > 1) {
                this.allCommunities = dataCreator.communities
              }
            });
        });
    }
  }

  getFilterContact(communityId) {
    console.log("communityId : ", communityId)
    this.viewCtrl.dismiss(communityId);
  }

}
