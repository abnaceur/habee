{
  "userId": "test_id1",
  "activeProfileRole": "1",
  "activeCommunity": "com_tes_2016_9",
    "lastname": "abdel",
    "firstname": "Abn",
    "birthDate": "12/12/1980",
    "address": "this is an address",
    "email": "abn@habee.com",
    "phone": "00337563546",
    "password": "0123456789",
  "communities": [],
    "profileCummunityId": "com_tes_2016_9",
    "profilePhoto": "/path/",
    "profileUsername": "Abdeljalil NACEUR",
    "profileIsAdmin": 0,
    "profileUserIsActive": 1,
    "profileUserIsDeleted": false,
  "passions": ["sub_passionId1", "sub_passionId2"],
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
  "activeCommunity": "com_tes_2016_9",
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