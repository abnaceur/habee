import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginProvider } from '../providers/login/login';
import { TabsPageModule } from "../pages/tabs/tabs.module"
import { ProfilePageModule } from "../pages/profile/profile.module";
import { MyEventsPageModule } from "../pages/my-events/my-events.module";
import { EventsPageModule } from "../pages/events/events.module";
import { BargainsPageModule } from "../pages/bargains/bargains.module";
import { LoginPageModule } from "../pages/login/login.module";
import { AdminPageModule } from "../pages/admin/admin.module";
import { UserProvider } from '../providers/user/user';
import { CommunityProvider } from '../providers/community/community';
import { EventProvider } from '../providers/event/event';


@NgModule({
  declarations: [
    MyApp,
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
    LoginPageModule,
    AdminPageModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    LoginProvider,
    UserProvider,
    CommunityProvider,
    EventProvider
  ]
})
export class AppModule { }
