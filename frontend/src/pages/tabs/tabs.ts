import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from "ionic-angular";

@IonicPage()
@Component({
	templateUrl: 'tabs.html'
})
export class TabsPage {

	tab1Root = "EventsPage";
	tab2Root = "MyEventsPage";
	tab3Root = "ProfilePage";
	tab4Root = "BargainsPage";
	tab5Root = "AdminPage";

	constructor(public navCtrl: NavController, public navParams: NavParams) {

	}
}
