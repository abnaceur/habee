import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, Tabs } from "ionic-angular";

@IonicPage()
@Component({
	templateUrl: 'tabs.html'
})



export class TabsPage {

	@ViewChild('myTabs') tabRef: Tabs;
	public tabParams;

	tab1Root = "EventsPage";
	tab2Root = "MyEventsPage";
	tab3Root = "ProfilePage";
	tab4Root = "ProposeEventPage";
	tab5Root = "GoodPlansPage";

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams
	) {
		console.log("testing inside the constructor 455 :", this.navParams,  this.navParams.data.length)
		if (this.navParams.data.length == 2) {
			this.tabParams = {
				userId: this.navParams.data[1]["userId"], 
				token: this.navParams.data[1]["token"],
				activeCommunity: this.navParams.data[1]['activeCommunity']
			};	
		} else {
			this.tabParams = {
				userId: this.navParams.get("userId"), 
				token: this.navParams.get("token"),
				activeCommunity: this.navParams.get('activeCommunity')
			};
		}
		console.log("UserID12: ", this.tabParams);
	}

	ionViewWillEnter() {
		if (this.navParams.data.length == 2) {
			if (this.navParams.data[0] == "Acceuil") 
				this.tabRef.select(0);
			
			
			if (this.navParams.data[0] == "Profile") 
				this.tabRef.select(3);
		}
	}



}
