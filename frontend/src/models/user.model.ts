import { Passion } from "./passion.model";
import { Skills } from "./skill.models";

class Profile {
    profileCommunityId: string;
    profilePhoto: string;
    profileUsername: string;
    profileIsAdmin: number;
    profiledateOfCreation: string;
    profileDateOfLastUpdate: string;
    profileUserIsActive: number;
}


class User {
    userId: string;
    activeCommunity: string;
    dateOfCreation: string;
    dateOfLastUpdate: string;
    credentials: {
        surname: string;
        firstname: string;
        birthDate: string;
        address: string;
        mail: string;
        phone: string;
        password: string;
    };
    communities: string[];
    profile: Profile[];
    passions: Passion[];
    skills: Skills[];
    currentEvents: {
        eventsICreated: string[];
        eventsIParticipate: string[];
    };
    parameters: {
    };
    passedEvents: {
        passedEventsICreated: string[];
        passedEventsIParticipated: string[];
    }
}

export { Profile, User };
