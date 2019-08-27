import { Component, ViewChild } from "@angular/core";

import {
  Nav,
  Platform,
  AlertController,
  MenuController,
  ModalController,
  Events,
  PopoverController,
  NavParams
} from "ionic-angular";

import { App } from 'ionic-angular';

import { StatusBar } from "@ionic-native/status-bar";

import { SplashScreen } from "@ionic-native/splash-screen";

import { environment as ENV } from "../environments/environment";

import { ProfileProvider } from "../providers/profile/profile";

import { Socket } from "ng-socket-io";

import { CommunityProvider } from "../providers/community/community";

import { UtilsProvider } from "../providers/utils/utils";

import { BackgroundMode } from "@ionic-native/background-mode";

import { EventFilterProvider } from "../providers/event-filter/event-filter";

import { EventProvider } from "../providers/event/event";

import { LocalNotifications } from "@ionic-native/local-notifications";

import { Storage } from '@ionic/storage';

import { AccountProvider } from '../providers/account/account';
import { not } from "@angular/compiler/src/output/output_ast";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = null;

  pages: Array<{
    title: string;
    component: any;
    active: boolean;
    icon: string;
  }>;
  rightMenuItems: Array<{ icon: string; active: boolean }>;
  state: any;
  placeholder = "assets/img/avatar/girl-avatar.png";
  chosenPicture: any;
  userData = {
    token: "",
    userFullname: "",
    userId: "",
    notificationStatus: false,
    activeCommunity: "",
    userImage: "",
  };
  public user = {
    name: "test",
    profileImage: "assets/img/avatar/girl-avatar.png"
  };
  public url = ENV.BASE_URL;
  public allCommunitiesbyUserId;
  public optionsMore = false;
  public editableCommunity: String;

  constructor(
    public alertCtrl: AlertController,
    public app: App,
    private accountProvider: AccountProvider,
    private storage: Storage,
    public localNotifications: LocalNotifications,
    private eventFilterProvider: EventFilterProvider,
    private eventProvider: EventProvider,
    private socket: Socket,
    private backgroundMode: BackgroundMode,
    private utils: UtilsProvider,
    public profileProvider: ProfileProvider,
    public events: Events,
    public platform: Platform,
    public statusBar: StatusBar,
    public menu: MenuController,
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    private communityProvider: CommunityProvider,
    public splashScreen: SplashScreen
  ) {
    this.initializeApp();

    this.backgroundMode.enable();
    // this.backgroundMode.excludeFromTaskList();
    // this.backgroundMode.overrideBackButton();

    events.subscribe("user:info", userData => {
      this.userData = userData;
    });

    this.storage.get('response').then((response) => {
      if (response != undefined) {
        this.userData = response;
      } else {
        events.subscribe("user:info", userData => {
          this.userData = userData;
        });
      }

      events.subscribe('profile:modified', (user, photo) => {
        // user and time are the same arguments passed in `events.publish(user, time)`
        this.userData.userImage = photo;
        this.userData.userFullname = user.profileFirstname + " " + user.profileLastname;
      });
    });

    this.rightMenuItems = [
      { icon: "home", active: true },
      { icon: "alarm", active: false },
      { icon: "analytics", active: false },
      { icon: "archive", active: false },
      { icon: "basket", active: false },
      { icon: "body", active: false },
      { icon: "bookmarks", active: false },
      { icon: "camera", active: false },
      { icon: "beer", active: false },
      { icon: "power", active: false }
    ];

    this.pages = [
      { title: "Events à l'affiche", component: "TabsPage", active: true, icon: "home" },
      {
        title: "Profil",
        component: "TabsPage",
        active: false,
        icon: "custom-profile"
      },
      {
        title: "Paramètres",
        component: "TabsPage",
        active: false,
        icon: "settings"
      },
      {
        title: "À propos",
        component: "TabsPage",
        active: false,
        icon: "information-circle"
      },
      {
        title: "Déconnexion",
        component: "TabsPage",
        active: false,
        icon: "log-out"
      }
    ];
  }

  pushLocalNotification(data) {
    this.localNotifications.schedule({
      id: Math.floor(Math.random() * 10000),
      text: "Vous avez un nouveau événement : " + data.eventName + " dans votre communauté : " + data.cpmmunityName,
      badge: 1
    });
  }

  initializeApp() {

    let events = [];

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.platform.pause.subscribe(() => {
        console.log("[INFO] App paused");
        //TODO ADD NOTIFICATION STATUS VALIDATION
        setTimeout(() => {
          this.socket.connect();
          if (this.userData && this.userData.notificationStatus == true) {
            this.backgroundMode.on("activate").subscribe(data => {
              this.socket.emit("join", this.userData.userId);
              this.socket.on("broad-event", data => {
                if (data != "") {
                  this.pushLocalNotification(data);
                }
              });
            });
          }
        }, 200);
      });

      this.platform.resume.subscribe(() => {
        events = [];
        console.log("[INFO] App resumed");
        this.backgroundMode.on("deactivate").subscribe(data => {
          this.socket.disconnect(true);
        });
      });

    });

    this.storage.get('response').then((response) => {
      if (response != null && response.token != null && response.userId != null) {
        this.events.publish("user:info", response);
        this.nav.push("TabsPage", response);
      } else {
        this.rootPage = "LoginPage";
      }
    });

    this.platform.registerBackButtonAction(() => {
      // Catches the active view
      let nav = this.app.getActiveNavs()[0];
      let activeView = nav.getActive();
      // Checks if can go back before show up the alert
      if (activeView.name === 'HomePage') {
        if (nav.canGoBack()) {
          nav.pop();
        } else {
          this.nav.setRoot('LoginPage', "logout");
          this.platform.exitApp();
        }
      }
    })
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario

    if (page.title == "Paramètres") {
      this.nav.push("GoodPlansPage", this.userData)
    } else if (page.title == "À propos") {
      this.nav.push("AppInfoPage", this.userData)
    }
    else {
      let menuData = [page.title, this.userData];
      this.nav.setRoot(page.component, menuData);
    }
  }

}
