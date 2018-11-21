import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { environment as ENV } from '../environments/environment';
import { ProfileProvider } from '../providers/profile/profile';
import { EventsPage } from '../pages/events/events';
import { TabsPage } from '../pages/tabs/tabs';
import { HabeeWalkthroughPage } from '../pages/habee-walkthrough/habee-walkthrough';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = "LoginPage";

  pages: Array<{ title: string, component: any, active: boolean, icon: string }>;
  rightMenuItems: Array<{ icon: string, active: boolean }>;
  state: any;
  placeholder = 'assets/img/avatar/girl-avatar.png';
  chosenPicture: any;
  userData: any;
  public user = {
    name: 'test',
    profileImage: 'assets/img/avatar/girl-avatar.png'
  };
  public url = ENV.BASE_URL;

  constructor(
    public profileProvider: ProfileProvider,
    public events: Events,
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen) 
    
    {
    this.initializeApp();
    events.subscribe('user:info', (userData) => {
      this.userData = userData;
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome user data : ', userData);
      this.profileProvider.getUserProfileByCommunityId(this.userData.token, this.userData.userId, this.userData.activeCommunity)
      .subscribe(response => {
        this.user.name = response.Users[0].profile[0].profileUsername,
        response.Users[0].profile[0].profilePhoto ?
        this.user.profileImage =  ENV.BASE_URL + '/' + response.Users[0].profile[0].profilePhoto
        : this.user.profileImage
      });
    });


    this.rightMenuItems = [
      { icon: 'home', active: true },
      { icon: 'alarm', active: false },
      { icon: 'analytics', active: false },
      { icon: 'archive', active: false },
      { icon: 'basket', active: false },
      { icon: 'body', active: false },
      { icon: 'bookmarks', active: false },
      { icon: 'camera', active: false },
      { icon: 'beer', active: false },
      { icon: 'power', active: false },
    ];

    this.pages = [
      { title: 'Acceuil', component: 'TabsPage', active: true, icon: 'home' },
      { title: 'Profile', component: 'TabsPage', active: false, icon: 'contact' },
      { title: 'Deconnexion', component: 'LoginPage', active: false, icon: 'log-out' },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    console.log("test this app :",  this.userData)
    let menuData = [page.title, this.userData]
    this.nav.setRoot(page.component,  menuData);
  }
}
