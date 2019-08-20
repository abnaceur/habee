import { Component } from "@angular/core";

import { IonicPage, NavController, NavParams } from "ionic-angular";

import { CommunityProvider } from "../../providers/community/community";

import { UtilsProvider } from "../../providers/utils/utils";

import { RemoveCommunityFromContactProvider } from "../../providers/remove-community-from-contact/remove-community-from-contact";

/**
 * Generated class for the RemoveCommunityFromContactPopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-remove-community-from-contact-popup",
  templateUrl: "remove-community-from-contact-popup.html"
})
export class RemoveCommunityFromContactPopupPage {
  allCommunities = [];
  public tabParams;
  private userCommunities;
  private contactInfo;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private removeCommunityFromContactProvider: RemoveCommunityFromContactProvider,
    private utils: UtilsProvider,
    private communityProvider: CommunityProvider
  ) {
    this.tabParams = this.navParams.get("tabParams");
    this.userCommunities = this.navParams.get("communities");
    this.contactInfo = this.navParams.get("contactInfo");
  }

  ionViewWillEnter() {
    this.getAllCommunities();
  }

  filterCommunities(communities) {
    let i = 0;
    let check = 0;
    let coms = [];

    while (i < communities.length) {
      this.userCommunities.map(com => {
        if (com.communityId === communities[i].communityId)
          check = 1;
      })

      if (check === 1) {
        coms.push(communities[i])
        check = 0;
      }
      i++;
    }
    this.allCommunities = coms;
  }

  getAllCommunities() {
    if (this.tabParams.activeCommunity != "") {
      this.communityProvider
        .getCommunitiesbyCreator(this.tabParams)
        .subscribe(dataCreator => {
          this.filterCommunities(dataCreator.communities);
        });
    }
  }

  removeCommunityFromContact(community) {
    this.removeCommunityFromContactProvider
      .removeCommunity(
        this.tabParams,
        this.contactInfo.userId,
        community.communityId
      )
      .subscribe(data => {
        if (data == 200)
          this.utils.notification("Désinscription prise en compte", "top");
        else if (data == 500)
          this.utils.notification("Desole une erreur est survenu !", "top");
      });
  }
}
