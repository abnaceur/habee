{
  "userId": "test_id222",
  "activeCommunity": "com_tes_2016_9",
  "credentials": {
    "username": "abdel",
    "firstname": "Abn",
    "birthDate": "12/12/1980",
    "address": "this is an address",
    "email": "abn@habee.com",
    "phone": "00337563546",
    "password": "0123456789"
  },
  "communities": [],
  "profile": [{
    "profileCummunityId": "com_tes_2016_9",
    "profilePhoto": "/path/",
    "profileUsername": "this",
    "profileIsAdmin": 0,
    "profileUserIsActove": 1
  }],
  "passions": ["5b6450cba2b6c50551c3ffd8"],
  "skills": [],
  "currentEvents": {
    "eventsICreated": [],
    "eventsIParticipate": []
  },
  "parameters": {},
  "passedEvents": {
    "PassedevenementsICreated": [],
    "PassedEvenementsParticipated": []
  }
}

/*
 ** Test /users/credentials route 
 */

{
  "userId": "test_id1",
  "activeCommunity": "com_tes_2016_9",
  "credentials": {
    "username": "Abdeljalil hero for ever",
    "firstname": "Abn",
    "birthDate": "12/12/1980",
    "address": "test@admin.com",
    "mail": "test@this.com",
    "phone": "00337563546",
    "password": "abdeljalil"
  },
}

/*
 ** Test /users/id/communityId  
 * 
 */

{
  "userId": "test_id222",
  "credentials": {
    "username": "Abdeljalil hero for ever",
    "firstname": "Abn",
    "birthDate": "12/12/1980",
    "address": "this is an address",
    "mail": "test@this.com",
    "phone": "00337563546",
    "password": "check pass"
  },
  "communities": [],
  "profile": [{
    "profileCummunityId": "com_tes_2016_9",
    "profilePhoto": "/path/",
    "profileUsername": "this",
    "profileIsAdmin": 1,
    "profileUserIsActove": 1
  } {
    "profileCummunityId": "com_tes_2016_19",
    "profilePhoto": "/path/",
    "profileUsername": "this",
    "profileIsAdmin": 1,
    "profileUserIsActove": 1
  } {
    "profileCummunityId": "com_tes_2016_92",
    "profilePhoto": "/path/",
    "profileUsername": "this",
    "profileIsAdmin": 1,
    "profileUserIsActove": 1
  }],
  "passions": [],
  "skills": [],
  "currentEvents": {
    "eventsICreated": [],
    "eventsIParticipate": []
  },
  "parameters": {},
  "passedEvents": {
    "PassedevenementsICreated": [],
    "PassedEvenementsParticipated": []
  }
}