import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//import {}

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;

	rootPage:any = "EventsPage";
	pages: Array<string>;
	pagesName: Array<string>;

	constructor(
		private platform: Platform, 
		private statusBar: StatusBar, 
		private splashScreen: SplashScreen) {
		this.pages = [
			'Events',
			'Parameters',
			'Profile',
			'Admin'
		];
		this.pagesName = [
			'Evénements',
			'Paramètres',
			"Profile",
			"Administration"
		]

		platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			statusBar.styleDefault();
			splashScreen.hide();
		});
	}

	openPage(page: string) {
		this.nav.setRoot(page + "Page")
	}
}
