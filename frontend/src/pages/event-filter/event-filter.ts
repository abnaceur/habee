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
import { Title } from '@angular/platform-browser';


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
  allCommunities = [];
  public tabParams;
  public selectAllFilters;
  public selectAllCommunitiesFilters;
  allfilters = [];
  communitiesFilter = [];

  constructor(
    private communityProvider: CommunityProvider,
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public eventProvider: EventProvider,
    public eventFilterProvider: EventFilterProvider,
    public navParams: NavParams) {

    this.tabParams = {
      userId: this.navParams.get("userId"),
      token: this.navParams.get("token"),
      activeCommunity: this.navParams.get('activeCommunity'),
      notificationStatus: this.navParams.get("notificationStatus")
    };

    this.eventProvider.getFilterOptions(this.tabParams)
      .subscribe(filters => {
        this.allfilters = filters.filterEvent;
        this.communitiesFilter = filters.communitiesFilter;
      })
  }

  ionViewWillEnter() {
    let activeFilters = 0;
    this.getAllCommunities()

    activeFilters = this.eventFilterProvider.objectFilterCount(this.allfilters);

    activeFilters != Array.from(Object.keys(this.allfilters)).length
      ? this.selectAllFilters = false : this.selectAllFilters = true
  }

  closeFilterModal() {
    this.viewCtrl.dismiss(this.allfilters);
  }

  closeConfirmModal() {
    this.eventProvider.saveFilterOptions(this.allfilters, this.tabParams, this.allCommunities)
      .subscribe(filters => {
        this.allfilters = filters;
      });
    this.viewCtrl.dismiss({
      filters: this.allfilters,
      comFilters: this.allCommunities
    });
  }

  selectAllCommunitiesFiltesFunc() {
    this.eventFilterProvider.changeComsFilterList(this.selectAllCommunitiesFilters, this.allCommunities)
      .then(filterUpdated => {
        if (Array.isArray(filterUpdated[0]))
          this.allCommunities = filterUpdated[0]
        else
          this.allCommunities = filterUpdated
      })
  }

  selectAllFiltersFunc() {
    this.eventFilterProvider.changeFilterList(this.selectAllFilters)
      .then(filterUpdated => {
        if (Array.isArray(filterUpdated[0]))
        this.allfilters = filterUpdated[0]
      else
        this.allfilters = filterUpdated
      })
  }

  initCommunitiesFilterValue(communities, check) {
    //TODO OPTIMISE THIS FUNCTION IN THE BACKEND
    let coms = [];
    let z = 0;
    let exist = 0;


    if (check === 0) {
      communities.map(com => {
        coms.push({
          communityId: com.communityId,
          communityName: com.communityName,
          value: true
        })
      })
      this.selectAllCommunitiesFilters = true;
    } else if (check === 1) {
      exist = 0;
      while (z < communities.length) {
        this.communitiesFilter.map(flt => {
          if (flt.communityId === communities[z])
            exist = 1;
        })

        if (exist === 1) {
          coms.push({
            communityId: communities[z].communityId,
            communityName: communities[z].communityName,
            value: true
          })
        } else if (exist === 0) {
          coms.push({
            communityId: communities[z].communityId,
            communityName: communities[z].communityName,
            value: false
          })
        }
        z++;
      }
    }
    this.allCommunities = coms;
  }

  getAllCommunities() {

    if (this.tabParams.activeCommunity != "") {
      this.communityProvider
        .getCommunitiesbyCreator(this.tabParams)
        .subscribe(dataCreator => {
          this.communityProvider
            .getCommunitiesByParticipation(this.tabParams)
            .subscribe(dataParticipation => {
              dataCreator.communities = dataCreator.communities.concat(dataParticipation);
              if (dataCreator.communities.length > 0) {
                if (this.communitiesFilter.length === 0)
                  this.initCommunitiesFilterValue(dataCreator.communities, 0)
                else {
                  this.allCommunities = this.communitiesFilter;
                  if (this.eventFilterProvider.objectFilterCount(this.allCommunities) === this.allCommunities.length)
                    this.selectAllCommunitiesFilters = true;
                }
              }
            });
        });
    }
  }

}
