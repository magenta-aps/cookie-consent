/* Copyright (C) 2019 Magenta ApS, http://magenta.dk.
   - Contact: info@magenta.dk.
   -
   - This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. */


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
        clearCookies()
    }
}

function clearCookies() {

    const del_cookies = conf.delete_cookies_on_decline
    const all_cookie_names = document.cookie.split(' ').map(function(c) {
        return c.split('=')[0]
    })

    function parseDomain(hostname) {
        var d = hostname.split('.')
        if (d.length > 1) {
            d[0] = ''
            return d.join('.')
        } else {
            return hostname
        }
    }

    function deleteData(names) {
        document.addEventListener('load', function() {
            names.forEach(function(name) {
                // Try to delete cookie of that name
                document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + parseDomain(location.hostname)

                // Also resets localStorage items of that name
                if (localStorage.getItem(name)) { 
                    localStorage.setItem(name, '')
                }

                // Also resets sessionStorage items of that name
                if (sessionStorage.getItem(name)) {
                    sessionStorage.setItem(name, '')
                }
            })
        })
    }
    
    if (typeof(del_cookies) === 'object') { // If cookie names were supplied, only delete cookies with those names
        const select_cookies = all_cookie_names.filter(function(cookie) {
            return del_cookies.find(function(cn) {
                return cn === cookie
            })
        })
        deleteData(select_cookies)
    } else if (del_cookies === true) { // Delete all the cookies
        deleteData(all_cookie_names)
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