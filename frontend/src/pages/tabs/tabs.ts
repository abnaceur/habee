import { Component, ViewChild } from "@angular/core";

import { IonicPage, NavController, NavParams, Nav, Tabs } from "ionic-angular";

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
  tab5Root = "GoodPlansPage";

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    if (this.navParams.data.length == 2) {
      this.tabParams = {
        userId: this.navParams.data[1]["userId"],
        token: this.navParams.data[1]["token"],
        activeCommunity: this.navParams.data[1]["activeCommunity"]
      };
    } else {
      this.tabParams = {
        userId: this.navParams.get("userId"),
        token: this.navParams.get("token"),
        activeCommunity: this.navParams.get("activeCommunity")
      };
    }
    console.log("UserID12: ", this.tabParams);
  }

  ionViewWillEnter() {
    console.log("this.navParams.data", this.navParams.data);
    if (this.navParams.data.length == 2) {
      if (this.navParams.data[0] == "Acceuil") this.tabRef.select(0);
      if (this.navParams.data[0] == "Parametre") this.tabRef.select(4);
      if (this.navParams.data[0] == "Profile") this.tabRef.select(3);
      if (this.navParams.data[0] == "listContact") this.tabRef.select(2);
    }
  }
}
