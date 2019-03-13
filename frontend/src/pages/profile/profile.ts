import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams, Item } from "ionic-angular";
import { Http, Headers, ResponseOptions } from "@angular/http";
import { environment as ENV } from "../../environments/environment";
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
    public navParams: NavParams
  ) {
    this.tabParams = {
      userId: this.navParams.get("userId"),
      token: this.navParams.get("token"),
      activeCommunity: this.navParams.get("activeCommunity"),
      notificationStatus: this.navParams.get("notificationStatus")
    };

    this.profileProvider
      .getUserProfileByCommunityId(this.tabParams)
      .subscribe(response => {
        this.user = response.User[0];
      });

    this.getProfileInfo();
  }

  ionViewWillEnter(){
    this.getProfileInfo();
  }

  getProfileInfo() {
    this.profileProvider
      .getUserProfileByCommunityId(this.tabParams)
      .subscribe(response => {
        this.user = response.User[0];
      });
  }
}
