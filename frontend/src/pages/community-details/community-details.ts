import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  ModalController,
  NavParams,
  AlertController
} from "ionic-angular";

import { UtilsProvider } from "../../providers/utils/utils";

import { CommunityProvider } from "../../providers/community/community";

import { environment as ENV } from "../../environments/environment";

import { RemoveCommunityFromContactProvider } from "../../providers/remove-community-from-contact/remove-community-from-contact";

/**
 * Generated class for the CommunityDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-community-details",
  templateUrl: "community-details.html"
})
export class CommunityDetailsPage {
  public url = ENV.BASE_URL;
  public tabParams;
  private comId;
  public community = {};
  public participation: boolean;

  page = 0;
  perPage = 0;
  totalData = 0;
  totalPage = 0;

  public communityEvents;

  constructor(
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private communityProvider: CommunityProvider,
    public modalCtrl: ModalController,
    private removeCommunityFromContactProvider: RemoveCommunityFromContactProvider,
    private utils: UtilsProvider
  ) {
    this.tabParams = this.navParams.get("userInfo");
    this.comId = this.navParams.get("comId");
    this.participation = this.navParams.get("participation");
  }

  ionViewWillEnter() {
    this.getCommunityDetails();
  }

  getCommunityDetails() {
    this.communityProvider
      .getCommunityDetails(this.tabParams, this.comId, this.page)
      .subscribe(response => {
        this.community = response;
        this.communityEvents = response.communityEvents.events;
        this.perPage = response.communityEvents.per_page;
        this.totalData = response.communityEvents.total;
        this.totalPage = response.communityEvents.total_pages;
      });
  }

  ionViewWillLeave() {
    this.page = 0;
  }

  doInfinite(infiniteScroll) {
    this.page = this.page + 1;

    console.log("Refresh")
    setTimeout(() => {
      this.communityProvider
      .getCommunityDetails(this.tabParams, this.comId, this.page)
      .subscribe(response => {
      this.communityEvents = this.communityEvents.concat(response.communityEvents.events);
      this.perPage = response.communityEvents.per_page;
      this.totalData = response.communityEvents.total;
      this.totalPage = response.communityEvents.total_pages;
      })
      console.log("Async operation has ended");
      infiniteScroll.complete();
    }, 1000);
  }

  editCommunityModal() {
    const modal = this.modalCtrl.create(
      "EditCommunityModalPage",
      {
        userInfo: this.tabParams,
        selectCommunity: this.comId
      },
      { cssClass: "" }
    );
    modal.onDidDismiss(data => {
      this.getCommunityDetails();
    });
    modal.present();
  }

  viewEventDetails(eventDetails) {
    this.navCtrl.push("EventDetailsPage", {
      data: eventDetails,
      userId: this.tabParams.userId,
      token: this.tabParams.token,
      activeCommunity: this.tabParams.activeCommunity
    });
  }

  openUserDetailsModal(userDetails, user) {
    let navInfo = {
      check: 0,
      userDetails: user,
      userId: userDetails,
      token: this.tabParams.token,
      activeCommunity: this.comId
    };

    this.modalCtrl
      .create("PopupUserDetailModalPage", navInfo, {
        cssClass: "userShow-modal"
      })
      .present();
  }

  removeContactAction(memberId, communityId) {
    this.removeCommunityFromContactProvider
      .removeCommunity(this.tabParams, memberId, communityId)
      .subscribe(data => {
        if (data == 200) {
          this.getCommunityDetails();
          if (this.participation == false)
            this.utils.notification("Membre désinscrit avec succes !", "top");
          if (this.participation == true)
            this.utils.notification("Vous etes désinscrit avec succes !", "top");
        } else if (data == 500)
          this.utils.notification("Desole une erreur est survenu !", "top");
      });
  }

  removeContact(memberId, communityId) {
    let alert = this.alertCtrl.create({
      title: 'Confirmation',
      message: 'Etes-vous sûr de vouloir supprimer ce contact ?',
      buttons: [
        {
          text: 'Fermer',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Confirmer',
          handler: () => {
            this.removeContactAction(memberId, communityId)
          }
        }
      ]
    });
    alert.present();
  }
}
