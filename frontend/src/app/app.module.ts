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
import { UserProvider } from '../providers/user/user'
import { EventDetailsPageModule } from '../pages/event-details/event-details.module';
import { UtilsProvider } from '../providers/utils/utils';
import { GoodPlansPageModule } from '../pages/good-plans/good-plans.module';
import { EventProvider } from '../providers/event/event';
import { HabeeWalkthroughPageModule } from '../pages/habee-walkthrough/habee-walkthrough.module';
import { ListContactPageModule } from '../pages/list-contact/list-contact.module';
import { RegisterCommunityUserPageModule } from '../pages/register-community-user/register-community-user.module';
import { RegisterPageModule } from '../pages/register/register.module';
import { AddCommunityPageModule } from '../pages/add-community/add-community.module';
import { AddContactPageModule } from '../pages/add-contact/add-contact.module';
import { EditCommunityModalPageModule } from '../pages/edit-community-modal/edit-community-modal.module';
import { EditProfilePageModule } from '../pages/edit-profile/edit-profile.module';
import { EditPasswordPageModule } from '../pages/edit-password/edit-password.module';
import { DeleteMyAccountPageModule } from '../pages/delete-my-account/delete-my-account.module';
import { EditAccountPageModule } from '../pages/edit-account/edit-account.module';


import { CameraProvider } from '../providers/camera/camera';
import { SharedModule   } from './shared.module';

import { Camera } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { RegisterProvider } from '../providers/register/register';
import { EventFilterProvider } from '../providers/event-filter/event-filter';
import { AddContactProvider } from '../providers/add-contact/add-contact';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    HttpModule,
    BrowserModule,
    TabsPageModule,
    ProfilePageModule,
    HabeeWalkthroughPageModule,
    MyEventsPageModule,
    EventsPageModule,
    LoginPageModule,
    ProposeEventPageModule,
    GoodPlansPageModule,
    EventDetailsPageModule,
    ListContactPageModule,
    RegisterCommunityUserPageModule,
    RegisterPageModule,
    AddContactPageModule,
    EditCommunityModalPageModule,
    AddCommunityPageModule,
    EditProfilePageModule,
    EditPasswordPageModule,
    DeleteMyAccountPageModule,
    EditAccountPageModule,
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
    FileTransfer,
    FileTransferObject, 
    File,
    RetrieveEventsProvider,
    CommunityProvider,
    ProfileProvider,
    UtilsProvider,
    PassionProvider,
    UtilsProvider,
    EventProvider,
    CameraProvider,
    UserProvider,
    RegisterProvider,
    EventFilterProvider,
    AddContactProvider,
  ]
})
export class AppModule { }
