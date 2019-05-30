import {
  HttpClient
} from '@angular/common/http';

import {
  Injectable
} from '@angular/core';

import {
  Http,
  Headers
} from '@angular/http';

import {
  UtilsProvider
} from '../../providers/utils/utils';

import {
  environment as ENV
} from '../../environments/environment';

import {
  FileTransfer,
  FileTransferObject,
  FileUploadOptions
} from '@ionic-native/file-transfer';

import {
  File
} from '@ionic-native/file';

import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController
} from "ionic-angular";
/*
  Generated class for the EventFilterProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EventFilterProvider {

  constructor(
    public http: Http,
    public utils: UtilsProvider,
    private file: File,
    private transfer: FileTransfer,
    private loadingCTRL: LoadingController) {
  }

  allfilters = [{
    name: "Publique",
    filter: "publicEvents",
    value: "",
  }, {
    name: "Sortie entre amis",
    filter: "sortieEntreAmis",
    value: "",
  }, {
    name: "Afterwork",
    filter: "afterwork",
    value: "",
  }, {
    name: "Cinéma",
    filter: "cinema",
    value: "",
  }, {
    name: "Sport",
    filter: "sport",
    value: "",
  }, {
    name: "Repas de famille",
    filter: "repasDeFamille",
    value: "",
  }, {
    name: "Farniente",
    filter: "farniente",
    value: "",
  }, {
    name: "Shopping",
    filter: "shopping",
    value: "",
  }, {
    name: "Ballade",
    filter: "ballade",
    value: "",
  }, {
    name: "Virée en vélo",
    filter: "virreEnVelo",
    value: "",
  }, {
    name: "Virée en voiture",
    filter: "vireEnVoiture",
    value: "",
  }, {
    name: "Picnic",
    filter: "picnic",
    value: "",
  }, {
    name: "Anniversaire",
    filter: "anniversaire",
    value: "",
  }, {
    name: "Danse",
    filter: "danse",
    value: "",
  }, {
    name: "Cutlure",
    filter: "cutlure",
    value: "",
  }, {
    name: "Nature",
    filter: "nature",
    value: "",
  }, {
    name: "Evènement en ville",
    filter: "evenementEnVille",
    value: "",
  }, {
    name: "Spectacle",
    filter: "spectacle",
    value: "",
  }, {
    name: "Retrouvailles",
    filter: "retrouvailles",
    value: "",
  }, {
    name: "Cousinade",
    filter: "cousinade",
    value: "",
  }, {
    name: "Match",
    filter: "match",
    value: "",
  }]

  filterlist = {
    SportValue: String,
    ArtsValue: String,
    cultureValue: String,
    MediaValue: String,
    musicValue: String,
    socialValue: String,
    internValue: String,
    businessValue: String,
    communityValue: String,
    santeValue: String,
    itValue: String,
    lifestyleValue: String,
    partyValue: String,
    meetingValue: String,
    PublicValue: Boolean,
    WorkshopValue: String
  }

  objectFilterCount(filter) {
    let i = 0;

    filter.map(flt => {
      if (flt.value === true)
        i++;
    })
    return i;
  }

  initFilter(value) {
    return new Promise((resolve, reject) => {
      this.allfilters.map(flt => {
        flt.value = value
      })

      resolve(this.allfilters);
    })

  }

  changeFilterList(selectAllFilters) {
    return new Promise((resolve, reject) => {
      if (selectAllFilters == true) {
        this.initFilter(true)
          .then(data => resolve(data))
      } else if (selectAllFilters == false) {
        this.initFilter(false)
          .then(data => resolve(data))
      }
    })
  }

}
