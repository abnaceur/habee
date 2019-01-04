

exports.inviteNewContact = (email, password, senderInfo) => {
    let msg = "Hello ! \n Vous avez recu une invitaion par " + senderInfo.firstName + senderInfo.lastName + " pour rejoindre sa communitee \
    \n voila vos logins : \n Email : " + email + "\n Mot de pass : " + password + "\
    \n P.S : Ce mot de passe est auto-genere, vous devez change votre de pass depuis l'app HABEE \
    \n TEAM HABEE"
    
    return msg
}

exports.inviteExistingContact = (senderInfo) => {
    let msg = "Hello ! \n \
    vous avez recus une invitation a joindre la communaute de " + senderInfo.firstName + senderInfo.lastName 
    
    return msg
}

exports.accountCreated = (email, password) => {
    let msg = "Hello ! \n Vous avez recu une invitaion pour rejoindre la communitee [nom de la communitee] \
    \n voila vos logins : \n Email : " + email + "\n Mot de pass : " + password + "\
    \n P.S : Ce mot de pass est genere autoatiquement, vouos devez change votre de pass depuis l'app HABEE \
    \n TEAM HABEE"

    return msg
}