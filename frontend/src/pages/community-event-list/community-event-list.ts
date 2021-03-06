import { Component } from '@angular/core';

import { IonicPage, NavController, ModalController, ViewController, NavParams } from 'ionic-angular';

import { UtilsProvider } from "../../providers/utils/utils";

import { environment as ENV } from "../../environments/environment";

import { CommunityProvider } from "../../providers/community/community";

/**
 * Generated class for the CommunityEventListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-community-event-list',
  templateUrl: 'community-event-list.html',
})
export class CommunityEventListPage {
  public url = ENV.BASE_URL;
  public contact;
  public tabParams;
  public allCommunities = [];
  public selectAll = false;
  private comSelected = [];


  constructor(
    public modalCtrl: ModalController,
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
  }

  ionViewWillEnter() {
    this.getAllCommunities()
  }

  getAllCommunities() {
    if (this.tabParams.activeCommunity != "") {
      this.communityProvider
        .getCommunitiesbyCreator(this.tabParams)
        .subscribe(dataCreator => {
        //  this.communityProvider
          //  .getCommunitiesByParticipation(this.tabParams)
          //  .subscribe(dataParticipation => {
          //    dataCreator.communities = dataCreator.communities.concat(dataParticipation);
              this.allCommunities = dataCreator.communities
          //  });
        });
    }
  }

  dismiss() {
    this.viewCtrl.dismiss(null);
  }

  creatNewCommunity() {
    const modal = this.modalCtrl.create("AddCommunityPage", this.tabParams, { cssClass: "comAdd-modal" });
    modal.onDidDismiss(data => {
      // this.updatCommunityList();
      this.getAllCommunities()
    });
    modal.present();
  }

  getActiveCom() {
    this.viewCtrl.dismiss(this.comSelected);
  }

  popComId(comId) {
    let i = 0;
    let tmp = [];

    while (i < this.comSelected.length) {
      if (this.comSelected[i] != comId)
        tmp.push(this.comSelected[i].communityId)
      i++;
    }

    return tmp
  }

  checkCommunity(com, ev) {
    if (ev.checked == true)
      this.comSelected.push(com.communityId)
    else if (ev.checked == true) {
      this.comSelected = this.popComId(com)
    }

  }

}
