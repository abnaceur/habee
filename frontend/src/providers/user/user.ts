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

@Injectable()
export class UserProvider {


  constructor(
    public http: Http,
    public utils: UtilsProvider,
  ) {
  
  }

  getAllUserByCommunityId(info, communities) {
    
    const header = this.utils.inihttpHeaderWIthToken(info.token);

    return this.http.post(ENV.BASE_URL + '/users/app/community/' + info.page +'/user/'+ info.userId ,
    communities,
      { headers: header })
      .map(response => response.json());
  }

  getAllusersCommunityConcat(info) {
    const header = this.utils.inihttpHeaderWIthToken(info.token);

    return this.http.get(ENV.BASE_URL + '/users/app/allcontacts/' + info.userId,
      { headers: header })
      .map(response => response.json());
  }

}
