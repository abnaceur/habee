import { Component, ViewChild } from "@angular/core";

import {
  Nav,
  Platform,
  MenuController,
  ModalController,
  Events,
  PopoverController,
  NavParams
} from "ionic-angular";

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

    this.storage.get('response').then((response) => {
      if (response != undefined) {
        console.log("Response :", response)
        this.userData = response;
      } else {
        events.subscribe("user:info", userData => {
          this.userData = userData;
          console.log("Response User data :", userData);
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

  pushLocalNotification() {
    this.localNotifications.schedule({
      id: Math.floor(Math.random() * 10000),
      text: "Vous avez un nouveau événement dans votre comunaute",
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
        this.socket.connect();
        setTimeout(() => {
          //TODO GET NOTIFICATION STATUS
          if (this.userData && this.userData.notificationStatus == true) {
            this.backgroundMode.on("activate").subscribe(data => {
              this.socket.emit("join", this.userData.activeCommunity);
              this.socket.on("broad-event", data => {
                if (data != "") {
                  if (events.indexOf(data.eventId) == -1) {
                    events.push(data.eventId);
                    this.eventProvider
                      .getFilterOptions(this.userData)
                      .subscribe(allFilters => {
                        let activeAllFilters = this.eventFilterProvider.objectFilterCount(
                          allFilters.filterEvent
                        );
                        if (activeAllFilters != 0) {
                          this.eventProvider
                            .checkIfNotifIsActive(
                              allFilters.filterEvent,
                              data.eventCategory
                            )
                            .then(count => {
                              if (count > 0) {
                                this.pushLocalNotification();
                              }
                            });
                        } else {
                          this.pushLocalNotification();
                        }
                      });
                  }
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
