import { Component, ViewChild } from "@angular/core";

import {
  IonicPage,
  NavController,
  NavParams,
  ModalController
} from "ionic-angular";

import { Http, ResponseOptions } from "@angular/http";

import { environment as ENV } from "../../environments/environment";

import { CommunityProvider } from "../../providers/community/community";

import "rxjs/add/operator/map";

import { ProfileProvider } from "../../providers/profile/profile";

@IonicPage()
@Component({
  selector: "page-profile",
  templateUrl: "profile.html"
})
export class ProfilePage {
  public tabParams;
  public url = ENV.BASE_URL;
  public coverImage = "assets/img/background/background-5.jpg";

  following = false;
  public user = {
    nbrCommunityByPrticipation: "",
    nbrCommunityByCreation: "",
    nbrCommunities: "",
    nbrEventsParticipated: "",
    profile: {
      profileUsername: "",
      profilePhoto: ""
    },
    eventCreated: ""
  };

  constructor(
    public profileProvider: ProfileProvider,
    public http: Http,
    public navCtrl: NavController,
    private communityProvider: CommunityProvider,
    public modalCtrl: ModalController,
    public navParams: NavParams
  ) {
    this.tabParams = {
      userId: this.navParams.get("userId"),
      token: this.navParams.get("token"),
      activeCommunity: this.navParams.get("activeCommunity"),
      notificationStatus: this.navParams.get("notificationStatus")
    };

    this.getProfileInfo();
  }

  ionViewWillEnter() {
    this.getCommunties();
    this.getProfileInfo();
  }

  getProfileInfo() {
    this.profileProvider
      .getUserProfileByCommunityId(this.tabParams)
      .subscribe(response => {
        console.log("response.User[0] : ", response.User[0]);
        this.user = response.User[0];
      });
  }

  editProfileModal() {
    const modal = this.modalCtrl.create("EditProfilePage", this.tabParams);
    modal.onDidDismiss(data => this.getProfileInfo());
    modal.present();
  }

  getCommunties() {
    this.communityProvider
      .getCommunitiesbyCreator(this.tabParams)
      .subscribe(dataCreator => {
        this.communityProvider
          .getCommunitiesByParticipation(this.tabParams)
          .subscribe(dataParticipation => {
            this.user.nbrCommunityByCreation = dataCreator.communities.length;
            this.user.nbrCommunityByPrticipation = dataParticipation.length
          });
      });
  }
}
