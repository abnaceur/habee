import {
  Injectable
} from '@angular/core';

import {
  Http,
  Headers
} from '@angular/http';

import {
  environment as ENV
} from '../../environments/environment';

import {
  UtilsProvider
} from '../../providers/utils/utils';


/*
  Generated class for the RegisterProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RegisterProvider {

  constructor
    (
    public http: Http,
    public utils: UtilsProvider,
  ) {
  }

  postUserCommuntiy(userId_, userData, usrPhotoRes, imgResCom) {
    const header = new Headers();
    header.append('Content-Type', 'application/json');

    return this.http.post(ENV.BASE_URL + '/users/user/community/create',
      {
        "userId": userId_,
        "activeCommunity": userData.commName,
        "communityDescripton": userData.commDescription,
        "activeProfileRole": 0,
        "communityLogo": imgResCom,
        "lastname": userData.lastName,
        "firstname": userData.firstName,
        "birthDate": "",
        "address": "",
        "email": userData.email,
        "phone": "",
        "password": userData.password,
        "communities": [userData.commName],
        "profileCummunityId": userData.commName,
        "profilePhoto": usrPhotoRes,
        "profileUsername": userData.firstName + " " + userData.lastName,
        "profileIsAdmin": 0,
        "profileUserIsActive": 1,
      },
      { headers: header })
      .map(response => response.json());
  }


  registerNewUserCommunity(userData, userPhoto, communityPhoto) {
    let userId_ = userData.email.substring(0, userData.email.search('@')) + '_' + Math.floor(Math.random() * 10000) + '_' + userData.email.substring(userData.email.search('@'), userData.email.lenght);

    //TODO UN DRY THIS FUNCTIONNALITY
    if (communityPhoto && userPhoto) {
      this.utils.uploadPhoto(communityPhoto)
        .then(imgResCom => {
          this.utils.uploadPhoto(userPhoto)
            .then(usrPhotoRes => {
              this.postUserCommuntiy(userId_, userData, usrPhotoRes, imgResCom)
                .subscribe(data => {
                  return data
                });;
            }).catch(err => {
              return err;
            })
        }).catch(err => {
          return err;
        })
    } else if (userPhoto === undefined && communityPhoto) {
      this.utils.uploadPhoto(communityPhoto)
        .then(imgResCom => {
          this.postUserCommuntiy(userId_, userData, userPhoto, imgResCom)
            .subscribe(data => {
              return data
            });;
        }).catch(err => {
          return err;
        })
    } else if (communityPhoto === undefined && userPhoto) {
      this.utils.uploadPhoto(userPhoto)
        .then(imgResUsr => {
          this.postUserCommuntiy(userId_, userData, imgResUsr, communityPhoto)
            .subscribe(data => {
              return data
            });
        }).catch(err => {
          return err;
        })
    }

    this.postUserCommuntiy(userId_, userData, userPhoto, communityPhoto)
      .subscribe(data => {
        if (data.results === "success") {
          this.utils.notification("Compte cree avec success", "top");
          return data
        } else {
          this.utils.notification("Une erreur est survenu!", "top")
          return data   
        }

      })
  }


  checkCommunityIfExist(name) {
    const header = new Headers();
    header.append('Content-Type', 'application/json');

    return this.http.get(ENV.BASE_URL + '/communities/' + name,
      { headers: header })
      .map(response => response.json());
  }
}