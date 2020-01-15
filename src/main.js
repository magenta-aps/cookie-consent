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