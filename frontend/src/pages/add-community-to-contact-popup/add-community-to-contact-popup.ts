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
  private userCommunities;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private communityProvider: CommunityProvider
  ) {

    this.tabParams = this.navParams.get("tabParams");
    this.userCommunities = this.navParams.get("communities");
    console.log("this.navParams : ", this.navParams)

  }

  ionViewWillEnter() {
    this.getAllCommunities()
  }

  filterCoomunitiesToAdd(communities) {
    let i = 0;
    let com = [];
    let z = 0;
    let check = 0;

    console.log("communities : ", communities, this.userCommunities)
    while (i < communities.length) {
      while(z < this.userCommunities.length) {
        if (this.userCommunities[z].communityId == communities[i].communityId)
          check++;
        z++;
      }
      if (check == 0)
        com.push(communities[i])
      
      check = 0;
      z = 0;
      i++;
    }

    console.log("Comm : ", com)
    this.allCommunities = com;
  }

  getAllCommunities() {
    console.log("aaa === aaaa", this.tabParams)
    if (this.tabParams.activeCommunity != "") {
      this.communityProvider
        .getCommunitiesbyCreator(this.tabParams)
        .subscribe(dataCreator => {
            //this.allCommunities = dataCreator.communities;
            console.log("this.userCommunities : ", this.userCommunities, this.allCommunities)
            this.filterCoomunitiesToAdd(dataCreator.communities)
        });
    }
  }
}
