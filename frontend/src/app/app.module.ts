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
import { CommunityProvider } from '../providers/community/community';
import { ProfileProvider } from '../providers/profile/profile';
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
import { InvitationListPageModule } from '../pages/invitation-list/invitation-list.module';
import { ForgotPasswordPageModule } from "../pages/forgot-password/forgot-password.module"
import { TermsOfServicePageModule } from "../pages/terms-of-service/terms-of-service.module"
import { TermsOfServiceScriptPageModule } from "../pages/terms-of-service-script/terms-of-service-script.module"
import {  ConatctListFilterPageModule } from "../pages/conatct-list-filter/conatct-list-filter.module"
import { AddCommunityToContactPopupPageModule } from "../pages/add-community-to-contact-popup/add-community-to-contact-popup.module" 
import { RemoveCommunityFromContactPopupPageModule } from "../pages/remove-community-from-contact-popup/remove-community-from-contact-popup.module"

import { CameraProvider } from '../providers/camera/camera';
import { SharedModule   } from './shared.module';

import { Camera } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { RegisterProvider } from '../providers/register/register';
import { EventFilterProvider } from '../providers/event-filter/event-filter';
import { AddContactProvider } from '../providers/add-contact/add-contact';
import { PasswordProvider } from '../providers/password/password';
import { AccountProvider } from '../providers/account/account';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { environment } from '../environments/environment.prod';
import { InvitationProvider } from '../providers/invitation/invitation';
//const config: SocketIoConfig = { url: "http://localhost:3000", options: {} };
const config: SocketIoConfig = { url: "http://192.168.42.140:3000", options: {} };
//const config: SocketIoConfig = { url: "http://10.18.187.205:3000", options: {} };
//const config: SocketIoConfig = { url: "https://aqueous-citadel-42524.herokuapp.com", options: {} };
import { BarcodeScanner } from '@ionic-native/barcode-scanner'; 
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BackgroundMode } from '@ionic-native/background-mode';
import { ProposeEventProvider } from '../providers/propose-event/propose-event';
import { CommunityEventListPageModule } from "../pages/community-event-list/community-event-list.module"
import { RemoveCommunityFromContactProvider } from '../providers/remove-community-from-contact/remove-community-from-contact';

import { CommunityDetailsPageModule } from "../pages/community-details/community-details.module";
import { IonicStorageModule } from '@ionic/storage';
import { CalendarModule } from "ion2-calendar";



@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    HttpModule,
    BrowserModule,
    ConatctListFilterPageModule,
    TabsPageModule,
    ProfilePageModule,
    HabeeWalkthroughPageModule,
    MyEventsPageModule,
    EventsPageModule,
    LoginPageModule,
    TermsOfServiceScriptPageModule,
    ProposeEventPageModule,
    CommunityDetailsPageModule,
    GoodPlansPageModule,
    EventDetailsPageModule,
    ListContactPageModule,
    RegisterCommunityUserPageModule,
    AddCommunityToContactPopupPageModule,
    RemoveCommunityFromContactPopupPageModule,
    RegisterPageModule,
    AddContactPageModule,
    EditCommunityModalPageModule,
    AddCommunityPageModule,
    EditProfilePageModule,
    EditPasswordPageModule,
    DeleteMyAccountPageModule,
    TermsOfServicePageModule,
    EditAccountPageModule,
    InvitationListPageModule,
    ForgotPasswordPageModule,
    CommunityEventListPageModule,
    SocketIoModule.forRoot(config),
    IonicModule.forRoot(MyApp, {tabsHideOnSubPages: true}),
    IonicStorageModule.forRoot(),
    CalendarModule,
    SharedModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    BarcodeScanner,
    SocialSharing,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    LoginProvider,
    Camera,
    FileTransfer,
    FileTransferObject, 
    File,
    CommunityProvider,
    ProfileProvider,
    UtilsProvider,
    UtilsProvider,
    EventProvider,
    CameraProvider,
    UserProvider,
    RegisterProvider,
    EventFilterProvider,
    AddContactProvider,
    PasswordProvider,
    AccountProvider,
    InvitationProvider,
    LocalNotifications,
    BackgroundMode,
    ProposeEventProvider,
    RemoveCommunityFromContactProvider
  ]
})
export class AppModule { }
