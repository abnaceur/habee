class Event {
    // attributes of data model used only for logic
    eventId: string;
    eventDateOfCreation: string;
    eventDateOfLastUpdate: string;
    eventCommunity: string;
    eventCreator: string;
    eventIsOver: boolean;


    // attributes of data model used for logic and displayed to user
    eventNbrOfParticipants: number;
    eventMaxNbrParticipants: number;
    eventParticipants: string[];
    eventDescription: string;
    eventLocation: string;
    eventDate: string;
    eventDuration: string;
    eventName: string;

    // generic images depending of eventType (one picture for sports, one for relaxation, etc...)
    eventImage: string;

    // everythong should be passed in the constructor, but for now, we will only use that to create the pages, it's easier
    constructor(image: string, name: string, description: string, date:string,
        MaxNbrOfParticipants: number, location: string, duration: string, creator: string) {
        this.eventNbrOfParticipants = 0;
        this.eventMaxNbrParticipants = MaxNbrOfParticipants;
        this.eventParticipants = [];
        this.eventCreator = creator;

        this.eventDescription = description;
        this.eventLocation = location;
        this.eventDate = date;
        this.eventDuration = duration;
        this.eventName = name;
        this.eventImage = image;
    }
}

export { Event };