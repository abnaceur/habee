import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { LoginProvider } from '../providers/login/login';
import { TabsPageModule } from "../pages/tabs/tabs.module"
import { ProfilePageModule } from "../pages/profile/profile.module";
import { MyEventsPageModule } from "../pages/my-events/my-events.module";
import { EventsPageModule } from "../pages/events/events.module";
import { BargainsPageModule } from "../pages/bargains/bargains.module";



@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
  ],
  imports: [
    HttpModule,
    BrowserModule,
    TabsPageModule,
    ProfilePageModule,
    MyEventsPageModule,
    EventsPageModule,
    BargainsPageModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    LoginProvider
  ]
})
export class AppModule { }
