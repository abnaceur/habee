import { Component, ViewChild } from "@angular/core";

import { IonicPage, NavController, NavParams, Nav, Tabs } from "ionic-angular";

import { BackgroundMode } from "@ionic-native/background-mode";

@IonicPage()
@Component({
  templateUrl: "tabs.html"
})
export class TabsPage {
  @ViewChild("myTabs") tabRef: Tabs;
  public tabParams;

  tab1Root = "EventsPage";
  tab2Root = "MyEventsPage";
  tab3Root = "ProfilePage";
  tab4Root = "ListContactPage";
  tab5Root = "CommunityPage";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private backgroundMode: BackgroundMode,
    ) {
    if (this.navParams.data.length == 2) {
      this.tabParams = {
        userId: this.navParams.data[1]["userId"],
        token: this.navParams.data[1]["token"],
        activeCommunity: this.navParams.data[1]["activeCommunity"],
        notificationStatus: this.navParams.data[1]["notificationStatus"]
      };
    } else {
      this.tabParams = {
        userId: this.navParams.get("userId"),
        token: this.navParams.get("token"),
        activeCommunity: this.navParams.get("activeCommunity"),
        notificationStatus: this.navParams.get("notificationStatus")
      };
    }
  }

  ionViewWillEnter() {
    if (this.navParams.data.length == 2) {
      if (this.navParams.data[0] == "Acceuil") this.tabRef.select(0);
      if (this.navParams.data[0] == "Profile") this.tabRef.select(4);
      if (this.navParams.data[0] == "listContact") this.tabRef.select(2);
      if (this.navParams.data[0] == "Deconnexion") {
        this.backgroundMode.disable();
        this.tabParams = [];
        this.navCtrl.setRoot("LoginPage")
      };
    }
  }
}
