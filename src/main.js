/* - Copyright (C) 2019 Magenta ApS, http://magenta.dk.
   - Contact: info@magenta.dk.
   -
   - This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. */


import CCGive from './CCGive.svelte'
import CCRevise from './CCRevise.svelte'

// Add consent giving component
const cc_give_consent = new CCGive({
	target: document.body,
	anchor: document.body.children[0],
	props: {
		cc_config: cookie_consent_config // `cookie_consent_config` is a varialbe declared in global scope
	}
})

// Add consent revision component
const cc_revise_consent = new CCRevise({
	target: document.body
})

export default {
	cc_give_consent,
	cc_revise_consent
}