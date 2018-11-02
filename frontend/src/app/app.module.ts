import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { SocialSharing } from '@ionic-native/social-sharing';

import { MyApp } from './app.component';
import { LoginProvider } from '../providers/login/login';
import { TabsPageModule } from "../pages/tabs/tabs.module"
import { ProfilePageModule } from "../pages/profile/profile.module";
import { MyEventsPageModule } from "../pages/my-events/my-events.module";
import { EventsPageModule } from "../pages/events/events.module";
import { LoginPageModule } from "../pages/login/login.module";
import { ProposeEventPageModule } from '../pages/propose-event/propose-event.module';
import { RetrieveEventsProvider } from '../providers/retrieve-events/retrieve-events';
import { CommunityProvider } from '../providers/community/community';
import { ProfileProvider } from '../providers/profile/profile';
import { PassionProvider } from '../providers/passion/passion';
import { EventDetailsPageModule } from '../pages/event-details/event-details.module';
import { UtilsProvider } from '../providers/utils/utils';
import { GoodPlansPageModule } from '../pages/good-plans/good-plans.module';
import { EventProvider } from '../providers/event/event';

import {SharedModule} from './shared.module';
import { CameraProvider } from '../providers/camera/camera';

import { Camera } from '@ionic-native/camera';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    HttpModule,
    BrowserModule,
    TabsPageModule,
    ProfilePageModule,
    MyEventsPageModule,
    EventsPageModule,
    LoginPageModule,
    ProposeEventPageModule,
    GoodPlansPageModule,
    EventDetailsPageModule,
    IonicModule.forRoot(MyApp, {tabsHideOnSubPages: true}),
    SharedModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    SocialSharing,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    LoginProvider,
    Camera,
    RetrieveEventsProvider,
    CommunityProvider,
    ProfileProvider,
    UtilsProvider,
    PassionProvider,
    UtilsProvider,
    EventProvider,
    CameraProvider,
    
  ]
})
export class AppModule { }
