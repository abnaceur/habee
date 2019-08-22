import { Component, ViewChild } from "@angular/core";

import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  Events,
  LoadingController
} from "ionic-angular";

import { Http, ResponseOptions } from "@angular/http";

import { environment as ENV } from "../../environments/environment";

import { CommunityProvider } from "../../providers/community/community";

import "rxjs/add/operator/map";

import { ProfileProvider } from "../../providers/profile/profile";

import { Storage } from '@ionic/storage';

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
      profilePhoto: "",
      profileFirstname: "",
      profileLastname: "",
    },
    eventCreated: ""
  };

  constructor(
    private storage: Storage,
    private loadingCTRL: LoadingController,
    public events: Events,
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
      notificationStatus: this.navParams.get("notificationStatus"),
      userImage: "",
      userFullname: "",
    };

    this.getProfileInfo(0);
  }

  ionViewWillEnter() {
    let loader = this.loadingCTRL.create({
      spinner: 'dots',
    });
    loader.present();
    this.getProfileInfo(0);
    loader.dismiss();
  }

  getProfileInfo(check) {
    // let loader = this.loadingCTRL.create({
    //   spinner: 'hide',
    //   content: `
    //     <div class="custom-spinner-container">
    //       <div class="custom-spinner-box">
    //          <img src="https://media0.giphy.com/media/8rE48TZOXKNKqrkMP6/source.gif" />
    //       </div>
    //     </div>`,
    // });



    this.profileProvider
      .getUserProfileByCommunityId(this.tabParams)
      .subscribe(response => {
        console.log("Response :", response);
        this.user = response.User[0];
        if (check === 1) {
          this.events.publish('profile:modified', this.user.profile, this.user.profile.profilePhoto);
          this.tabParams.userFullname = this.user.profile.profileFirstname + " " + this.user.profile.profileLastname;
          this.tabParams.userImage = this.user.profile.profilePhoto;
          this.storage.remove('response')
            .then(resp => console.log("Response removerd"))
            .catch(err => console.log("error storage !"));
          this.storage.clear();
          this.storage.set("response", this.tabParams);
        }
      });
  }

  editProfileModal() {
    const modal = this.modalCtrl.create("EditProfilePage", { info: this.tabParams, user: this.user.profile }, {
      cssClass: ""
    });
    modal.onDidDismiss(data => {
      this.getProfileInfo(1)
    });
    modal.present();
  }

  // getCommunties() {
  //   this.communityProvider
  //     .getCommunitiesbyCreator(this.tabParams)
  //     .subscribe(dataCreator => {
  //       this.communityProvider
  //         .getCommunitiesByParticipation(this.tabParams)
  //         .subscribe(dataParticipation => {
  //           this.user.nbrCommunityByCreation = dataCreator.communities.length;
  //           this.user.nbrCommunityByPrticipation = dataParticipation.length;
  //         });
  //     });
  // }
}
