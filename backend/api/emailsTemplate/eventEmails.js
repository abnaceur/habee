

exports.deleteEvent = (participant, event) => {
    let msg = "Hello !"+ participant.participantname + " \n \
    L'evenmenet : \n \
    Titre : " + event.eventName + "\n \
    Commence le :" + event.eventStartDate.substring(8,10) + "." + event.eventStartDate.substring(5,7) + "." + event.eventStartDate.substring(0, 4) + " " + event.eventStartHour + "\n \
    Viens d'etre annuler par son createur.\n \
    \n TEAM HABEE"
    
    return msg
}
 