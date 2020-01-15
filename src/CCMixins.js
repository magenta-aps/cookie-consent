import { consent, config } from './CCStore.js'

// Global events

let ev_give = document.createEvent('Event'),
    ev_decline = document.createEvent('Event')

ev_give.initEvent('consentgiven', true, true)
ev_decline.initEvent('consentdeclined', true, true)


// Store values

let conf

const conf_subscription = config.subscribe(c => {
    conf = c
})


// Reusable methods

function sayYes() {
    setConsent(true)
    dispatch(true)
}

function sayNo() {
    setConsent(false)
    dispatch(false)
}

function setConsent(consent_boolean) {
    consent.set(consent_boolean)
    localStorage.setItem(conf.localStorageId, consent_boolean)
}

function dispatch(consent_boolean) {
    if (consent_boolean === true) {
        document.dispatchEvent(ev_give)
    } else if (consent_boolean === false) {
        document.dispatchEvent(ev_decline)
    }
}

export {
    sayYes,
    sayNo,
    dispatch,
    setConsent,
    ev_give,
    ev_decline
}