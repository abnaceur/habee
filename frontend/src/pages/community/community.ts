import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { UtilsProvider } from "../../providers/utils/utils";

import { CommunityProvider } from "../../providers/community/community";

import { environment as ENV } from "../../environments/environment";

/**
 * Generated class for the CommunityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-community',
  templateUrl: 'community.html',
})
export class CommunityPage {

  public url = ENV.BASE_URL;
  public tabParams;

  page = 0;
  perPage = 0;
  totalData = 0;
  totalPage = 0;

  public myCommunitiesBorder = "5px solid darkgrey";
  public myCommunitiesBorderDisplay = "initial";
  public communitiesByInvteBorder = "";
  public communitiesByInvteBorderDisplay = "none";

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private communityProvider: CommunityProvider,
    private utils: UtilsProvider,
   ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommunityPage');
  }

  selectMyCommunities() {
    this.myCommunitiesBorder = "5px solid darkgrey";
    this. myCommunitiesBorderDisplay = "initial";
    this.communitiesByInvteBorder = "";
    this.communitiesByInvteBorderDisplay = "none";
  }

  selectCommunitiesByInvte() {
    this.myCommunitiesBorder = "";
    this. myCommunitiesBorderDisplay = "none";
    this.communitiesByInvteBorder = "5px solid darkgrey";
    this.communitiesByInvteBorderDisplay = "initial";
  }

}
