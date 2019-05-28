import { Component } from "@angular/core";

import { IonicPage, NavController, NavParams } from "ionic-angular";

import { CommunityProvider } from "../../providers/community/community";

import { UtilsProvider } from "../../providers/utils/utils";

import { AddContactProvider } from "../../providers/add-contact/add-contact";

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
  private contactInfo;

  constructor(
    public navCtrl: NavController,
    private addContactProvider: AddContactProvider,
    public navParams: NavParams,
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

  filterCoomunitiesToAdd(communities) {
    let i = 0;
    let com = [];
    let z = 0;
    let check = 0;

    while (i < communities.length) {
      while (z < this.userCommunities.length) {
        if (this.userCommunities[z].communityId == communities[i].communityId)
          check++;
        z++;
      }
      if (check == 0) com.push(communities[i]);

      check = 0;
      z = 0;
      i++;
    }

    this.allCommunities = com;
  }

  getAllCommunities() {
    if (this.tabParams.activeCommunity != "") {
      this.communityProvider
        .getCommunitiesbyCreator(this.tabParams)
        .subscribe(dataCreator => {
          this.filterCoomunitiesToAdd(dataCreator.communities);
        });
    }
  }

  sendAddInvitation(community) {
    let arrayContact = [];

    arrayContact.push({
      value: this.contactInfo.userEmail,
      check: "",
      status: "",
      communities: [community.communityId]
    });

    this.addContactProvider
      .sendContactInvitation(arrayContact, this.tabParams)
      .subscribe(data => {
        if (data.msg[0].status == 200)
          this.utils.notification("Invitation envoyée avec succes", "top");
        else if (data.msg[0].status == 204)
          this.utils.notification(
            "Ce contact est deja invite a cette communaute",
            "top"
          );
        else if (data.msg[0].status == 202)
          this.utils.notification(
            "Contact ajouter avec succes",
            "top"
          );
        else if (data.msg[0].status == 500)
          this.utils.notification(
            "Ce contact exist !",
            "top"
          );
        else this.utils.notification("Une erreur est survenu!", "top");
      });
  }
}
