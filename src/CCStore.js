import { writable } from 'svelte/store'

export const consent = writable(false)

export const config = writable({
    localStorageId: 'CookieConsentByMagenta-v1-0-0',
    messages: {
        title: 'Samtykke til brug af cookies',
        introduction: 'Vi vil gerne gemme information i din browser.',
        purposes: ['Der er intet formål med det'],
        additionalInfo: '<a href="">Her bør der være et link til yderligere information</a>',
        acceptButtonTxt: 'Ja tak',
        declineButtonTxt: 'Nej tak',
        acceptedTxt: 'accepteret',
        declinedTxt: 'afvist',
        revisionTitleDeclined: 'Du har ikke givet samtykke',
        revisionAskToAccept: 'Du har ikke givet samtykke til brug af cookies. Vil du give samtykke?',
        revisionTitleAccepted: 'Du har givet samtykke',
        revisionAskToDecline: 'Du har givet samtykke til brug af cookies. Har du fortrudt?',
        revisionDeclineAction: 'Træk mit samtykke tilbage',
        revisionCloseDiag: 'Luk samtykke-box'
    }
})