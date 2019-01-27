import {
  Component,
  ViewChild
} from '@angular/core';

import {
  Nav,
  Platform,
  MenuController,
  ModalController,
  Events,
  PopoverController,
  NavParams
} from 'ionic-angular';

import {
  StatusBar
} from '@ionic-native/status-bar';

import {
  SplashScreen
} from '@ionic-native/splash-screen';

import {
  environment as ENV
} from '../environments/environment';

import {
  ProfileProvider
} from '../providers/profile/profile';

import {
  EventsPage
} from '../pages/events/events';

import {
  TabsPage
} from '../pages/tabs/tabs';

import {
  HabeeWalkthroughPage
} from '../pages/habee-walkthrough/habee-walkthrough';

import {
  CommunityProvider
} from '../providers/community/community';

import {
  UtilsProvider
} from '../providers/utils/utils'

import { Subscriber } from 'rxjs/Subscriber';



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
  public allCommunitiesbyUserId;
  public optionsMore = false
  public editableCommunity: String;

  constructor(
    private utils: UtilsProvider,
    public profileProvider: ProfileProvider,
    public events: Events,
    public platform: Platform,
    public statusBar: StatusBar,
    public menu: MenuController,
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    private communityProvider: CommunityProvider,
    public splashScreen: SplashScreen) {
    this.initializeApp();
    events.subscribe('user:info', (userData) => {
      this.userData = userData;
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome user data : ', userData);
      this.profileProvider.getUserProfileByCommunityId(this.userData)
        .subscribe(response => {
          console.log("Heree there :", response)
          this.user.name = response.Users[0].profile.profileUsername,
            response.Users[0].profile.profilePhoto ?
              this.user.profileImage = ENV.BASE_URL + '/' + response.Users[0].profile.profilePhoto
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
      { title: 'Accueil', component: 'TabsPage', active: true, icon: 'home' },
      { title: 'Profile', component: 'TabsPage', active: false, icon: 'contact' },
      { title: 'Communaute', component: '', active: false, icon: 'people' },
      { title: 'Parametre', component: '', active: false, icon: 'power' },
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

  backToMainMenu() {
    this.optionsMore = false;
    this.menu.enable(true, "menu-material")
    this.menu.toggle("menu-material")
  }


  goToAddCommunityModal() {
    //this.nav.setRoot("AddCommunityPage");
    const modal = this.modalCtrl.create('AddCommunityPage', this.userData);
    modal.onDidDismiss(data => {
      this.updatCommunityList()
      this.optionsMore = false
    })
    modal.present();
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario

    if (page.title == 'Communaute') {
      this.menu.getMenus();
      this.updatCommunityList()
      this.menu.enable(true, "menu-community")
      this.menu.toggle("menu-community");
    } else {
      let menuData = [page.title, this.userData]
      this.nav.setRoot(page.component, menuData);
    }
  }

  selectCommunity(comId) {
    this.communityProvider.updateSelectedCommunity(comId, this.userData)
      .subscribe(data => {
        if (data === 1) {
          this.userData.activeCommunity = comId;
          this.communityProvider.getCommunitiesbyCreator(this.userData)
            .subscribe(data => {
              this.communityProvider.getCommunitySelected(data.communities, this.userData.activeCommunity)
                .then(data => {
                  this.allCommunitiesbyUserId = data;
                  this.menu.enable(true, "menu-material")
                  //  this.menu.toggle("menu-avatar");
                  this.nav.push("TabsPage", this.userData);
                });
            });
        }
      })
  }

  updatCommunityList() {
    this.communityProvider.getCommunitiesbyCreator(this.userData)
    .subscribe(data => {
      this.communityProvider.getCommunitySelected(data.communities, this.userData.activeCommunity)
        .then(data => {
          this.allCommunitiesbyUserId = data;
        });
    });
  }

  editCommunity() {
    const modal = this.modalCtrl.create('EditCommunityModalPage', {
      userInfo: this.userData,
      selectCommunity: this.editableCommunity
    });
    modal.onDidDismiss(data => {
      this.updatCommunityList();
      this.optionsMore = false
    })
    modal.present();
  }

  presentPopover(community) {
    this.optionsMore = true
    this.editableCommunity = community;
  }

  deletCommunity() {
    
    this.communityProvider.deleteCommunity(this.userData, this.editableCommunity)
      .subscribe(code => {
        if (code === 200) {
          this.utils.notification("Cette communaute est suprimer avec succes", "top")
          this.updatCommunityList();
        } else
          this.utils.notification("Une erreur est survenu !", "top")
      })
  }
}
