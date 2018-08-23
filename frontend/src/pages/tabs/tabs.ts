import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from "ionic-angular";

@IonicPage()
@Component({
	templateUrl: 'tabs.html'
})
export class TabsPage {
	public tabParams;

	tab1Root = "EventsPage";
	tab2Root = "MyEventsPage";
	tab3Root = "ProfilePage";
	tab4Root = "ProposeEventPage";
	tab5Root = "GoodPlansPage";

	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.tabParams = {
			userId: this.navParams.get("userId"), 
			token: this.navParams.get("token"),
			activeCommunity: this.navParams.get('activeCommunity')
		};
		console.log("UserID12: ", this.tabParams);
	}


}
