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
 * Generated class for the CommunityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-community",
  templateUrl: "community.html"
})
export class CommunityPage {
  public url = ENV.BASE_URL;
  public tabParams;

  page = 0;
  perPage = 0;
  totalData = 0;
  totalPage = 0;

  public comListByCreator: any[];
  public comListByParticipation: any[];

  public myCommunitiesBorder = "5px solid darkgrey";
  public myCommunitiesBorderDisplay = "initial";
  public communitiesByInvteBorder = "";
  public communitiesByInvteBorderDisplay = "none";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private communityProvider: CommunityProvider,
    public modalCtrl: ModalController,
    private utils: UtilsProvider
  ) {
    this.tabParams = {
      userId: this.navParams.get("userId"),
      token: this.navParams.get("token"),
      activeCommunity: this.navParams.get("activeCommunity"),
      notificationStatus: this.navParams.get("notificationStatus")
    };
  }

  ionViewWillEnter() {
    this.getComListByCreation();
    this.getComListByParticipation();
  }

  getComListByCreation() {
    this.communityProvider
      .getCommunitiesbyCreator(this.tabParams)
      .subscribe(data => {
        this.comListByCreator = data.communities;
      });
  }

  getComListByParticipation() {
    this.communityProvider
      .getCommunitiesByParticipation(this.tabParams)
      .subscribe(data => {
        this.comListByParticipation = data;
      });
  }

  selectMyCommunities() {
    this.myCommunitiesBorder = "5px solid darkgrey";
    this.myCommunitiesBorderDisplay = "initial";
    this.communitiesByInvteBorder = "";
    this.communitiesByInvteBorderDisplay = "none";
  }

  selectCommunitiesByInvte() {
    this.myCommunitiesBorder = "";
    this.myCommunitiesBorderDisplay = "none";
    this.communitiesByInvteBorder = "5px solid darkgrey";
    this.communitiesByInvteBorderDisplay = "initial";
  }

  addCommunity() {
    const modal = this.modalCtrl.create("AddCommunityPage", this.tabParams, {
      cssClass: ""
    });
    modal.onDidDismiss(data => {
      this.getComListByCreation();
    });
    modal.present();
  }

  showComDatails(comId, value) {
    let data = {
      userInfo: this.tabParams,
      comId,
      participation: value
    };

    this.navCtrl.push("CommunityDetailsPage", data);
  }

  deleteCommunity(communityId) {
    if (this.comListByCreator.length > 1) {
      this.communityProvider.deleteCommunity(this.tabParams, communityId)
      .subscribe(data => {
        if (data === 200)
        this.utils.notification("Cette communautè est supprimèe avec succès !", "top");
        else
        this.utils.notification("Désolé. Un problème est survenu. Veuillez réessayer plus tard. !", "top");
      })
    } else {
      this.utils.notification("Vous avez une seul communautè !", "top");      
    }
  }

}
