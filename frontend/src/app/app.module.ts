import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TabsPageModule } from "../pages/tabs/tabs.module";
import { ProfilePageModule } from "../pages/profile/profile.module";
import { MyEventsPageModule } from "../pages/my-events/my-events.module";
import { EventsPageModule } from "../pages/events/events.module";
import { BargainsPageModule } from "../pages/bargains/bargains.module";

@NgModule({
	declarations: [
		MyApp,
		HomePage,
	],
	imports: [
		BrowserModule,
		IonicModule.forRoot(MyApp),
		TabsPageModule,
		ProfilePageModule,
		MyEventsPageModule,
		EventsPageModule,
		BargainsPageModule
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		HomePage,
	],
	providers: [
		StatusBar,
		SplashScreen,
		{provide: ErrorHandler, useClass: IonicErrorHandler}
	]
})
export class AppModule {}
