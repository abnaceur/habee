import {
  Component
} from '@angular/core';

import {
  IonicPage,
  NavController,
  ViewController,
  NavParams
} from 'ionic-angular';

import {
  EventProvider
} from '../../providers/event/event';

import { CommunityProvider } from "../../providers/community/community";

import {
  EventFilterProvider
} from '../../providers/event-filter/event-filter';
import { listener } from '@angular/core/src/render3/instructions';


/**
 * Generated class for the EventFilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-filter',
  templateUrl: 'event-filter.html',
})
export class EventFilterPage {
  public filterList = {}
  allCommunities = [];
  public tabParams;
  public selectAllFilters;

  constructor(
    private communityProvider: CommunityProvider,
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public eventProvider: EventProvider,
    public eventFilterProvider: EventFilterProvider,
    public navParams: NavParams) {

    this.filterList = this.eventFilterProvider.filterlist;
    this.tabParams = {
      userId: this.navParams.get("userId"),
      token: this.navParams.get("token"),
      activeCommunity: this.navParams.get('activeCommunity'),
      notificationStatus: this.navParams.get("notificationStatus")
    };
  
  

    this.eventProvider.getFilterOptions(this.tabParams)
      .subscribe(filters => {
        let filter = filters.filterEvent;
        this.eventFilterProvider.initFilterList(this.filterList, filter)
        .then(filterList => {
            this.filterList = filterList
          })
      })
  }

  ionViewWillEnter() {
    let activeFilters = 0;
    this.getAllCommunities()  
    
    activeFilters = this.eventFilterProvider.objectFilterCount(this.filterList);

    activeFilters != Array.from(Object.keys(this.filterList)).length
    ? this.selectAllFilters = false : this.selectAllFilters = true
  }

  closeFilterModal() {
    this.viewCtrl.dismiss(this.filterList);
  }

  closeConfirmModal() {
    this.eventProvider.saveFilterOptions(this.filterList, this.tabParams)
      .subscribe(filters => {
        this.filterList = filters;
      });
    this.viewCtrl.dismiss(this.filterList);
  }

  selectAllFiltersFunc() {
    this.eventFilterProvider.changeFilterList(this.selectAllFilters)
    .then(filterUpdated => this.filterList = filterUpdated)
  }

  getAllCommunities() {
    if (this.tabParams.activeCommunity != "") {
      this.communityProvider
        .getCommunitiesbyCreator(this.tabParams)
        .subscribe(dataCreator => {
          this.communityProvider
            .getCommunitiesByParticipation(this.tabParams)
            .subscribe(dataParticipation => {
              console.log("dataCreator : ", dataCreator.communities, dataParticipation)
              dataCreator.communities = dataCreator.communities.concat(dataParticipation);
              if (dataCreator.communities.length > 1) {
                this.allCommunities = dataCreator.communities
                console.log("this.allCommunities : ", this.allCommunities)
              }
            });
        });
    }
  }

}
