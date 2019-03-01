

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

exports.accountFirstCreation = (email, password) => {
    let msg = "Hello! bienvenue \n Vous venez de cree votre compte pour rejoindre la communitee Habee \
    \n Voila vos logins : \n Email : " + email + "\n Mot de pass : " + password + "\
    \n TEAM HABEE"

    return msg
}

exports.resetPassword = (email, password) => {
    let msg = "Hello! \n Votre mot de passe est bien reinitialiser \
    \n Voila vos logins : \n Email : " + email + "\n Mot de pass : " + password + "\
    \n \n P.S: Ce mot de passe est genere automatiquement \
    rappellez vous de le changer \
    \n TEAM HABEE"

    return msg
}