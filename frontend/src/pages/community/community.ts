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

  pageComCreated = 0;
  perPageComCreated = 0;
  totalDataComCreated = 0;
  totalPageComCreated = 0;

  pageComParticipation = 0;
  perPageComParticipation = 0;
  totalDataComParticipation = 0;
  totalPageComParticipation = 0;

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
    this.getComListByParticipation();
    this.getComunitiesList();
  }

  getComunitiesList() {
    this.communityProvider.
      getCommunitiesListbyUserId(this.tabParams, this.pageComCreated)
      .subscribe(data => {
        if (data) {
          this.comListByCreator = data.communitiesCreated.userCreatedComs;
          this.perPageComCreated = data.communitiesCreated.per_page;
          this.totalDataComCreated = data.communitiesCreated.total;
          this.totalPageComCreated = data.communitiesCreated.total_pages;
         
          this.comListByParticipation = data.communitiesParticipated.coms;
          this.perPageComParticipation = data.communitiesParticipated.per_page;
          this.totalDataComParticipation = data.communitiesParticipated.total;
          this.totalPageComParticipation = data.communitiesParticipated.total_pages;
         
        }
      })

  }

  ionViewWillLeave() {
    this.pageComCreated = 0;
  }

  doInfiniteComParticipation(infiniteScroll) {
    this.pageComParticipation = this.pageComParticipation + 1;

    console.log("Refresh")
    setTimeout(() => {
      this.communityProvider.
        getCommunitiesListbyUserId(this.tabParams, this.pageComParticipation)
        .subscribe(data => {
          if (data) {
            this.comListByParticipation = this.comListByParticipation.concat(data.communitiesParticipated.coms);
            this.perPageComParticipation = data.communitiesParticipated.per_page;
            this.totalDataComParticipation = data.communitiesParticipated.total;
            this.totalPageComParticipation = data.communitiesParticipated.total_pages;
           
          }
        })
      console.log("Async operation has ended");
      infiniteScroll.complete();
    }, 1000);
  }

  doInfiniteComCreated(infiniteScroll) {
    this.pageComCreated = this.pageComCreated + 1;

    console.log("Refresh")
    setTimeout(() => {
      this.communityProvider.
        getCommunitiesListbyUserId(this.tabParams, this.pageComCreated)
        .subscribe(data => {
          if (data) {
            this.comListByCreator = this.comListByCreator.concat(data.communitiesCreated.userCreatedComs);
            this.perPageComCreated = data.communitiesCreated.per_page;
            this.totalDataComCreated = data.communitiesCreated.total;
            this.totalPageComCreated = data.communitiesCreated.total_pages;
          }
        })
      console.log("Async operation has ended");
      infiniteScroll.complete();
    }, 1000);
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
      this.pageComParticipation = 0;
      this.pageComCreated = 0;
      this.getComListByParticipation();
      this.getComunitiesList();
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
          if (data === 200) {
            this.utils.notification("Cette communautè est supprimèe avec succès !", "top");
            this.getComListByCreation();
          }
          else
            this.utils.notification("Désolé. Un problème est survenu. Veuillez réessayer plus tard. !", "top");
        })
    } else {
      this.utils.notification("Vous avez une seul communautè !", "top");
    }
  }

}
