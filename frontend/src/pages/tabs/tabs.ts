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
	tab4Root = "BargainsPage";
	tab5Root = "AdminPage";

	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.tabParams = {
			userId: this.navParams.get("userId"), 
			token: this.navParams.get("token")
		};
		console.log("UserID: ", this.tabParams.userId);
	}
}
