<!-- Copyright (C) 2019 Magenta ApS, http://magenta.dk.
   - Contact: info@magenta.dk.
   -
   - This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->

<script>

    import { consent, config } from './CCStore.js'
    import { onMount } from 'svelte'
    import { fly } from 'svelte/transition'
    import { sayYes, sayNo, dispatch, setConsent, ev_give, ev_decline } from './CCMixins.js'
	
	// Props
    export let cc_config

	// Methods 
	function checkConsent() {
        let str = localStorage.getItem($config.localStorageId)
        if (str) {
			let c = (str === 'true')
			consent.set(c)
			dispatch(c)
        } else {
			consent.set(null)
		}
	}

	// Initialize
	onMount(async () => {
        config.update(c => {
			let conf = c
			if (cc_config.localStorageId) {
				conf.localStorageId = cc_config.localStorageId
			}
			if (cc_config.messages) {        
				for (let m in cc_config.messages) {
					conf.messages[m] = cc_config.messages[m]
				}
			}
            return conf
        })
		checkConsent()
	})
	
</script>


{#if $consent === null}
    <div class="cc-diag" 
         role="alertdialog" 
         aria-live="assertive" 
         aria-labelledby="give-consent-title"
         transition:fly="{{ y: -300, duration: 300 }}">

        <h2 id="give-consent-title" class="cc-title">{ $config.messages.title }</h2>
        <p class="cc-intro">{ $config.messages.introduction }</p>
        <ul class="cc-list">
            {#each $config.messages.purposes as purpose}
                <li class="cc-list-item">{ purpose }</li>
            {/each}
        </ul>
        <p class="cc-additional">{ @html $config.messages.additionalInfo }</p>
        <p class="cc-actions">
            <button on:click={ sayYes } aria-controls="cookie-consent-diag" class="cc-accept">{ $config.messages.acceptButtonTxt }</button>
            <button on:click={ sayNo } aria-controls="cookie-consent-diag" class="cc-decline">{ $config.messages.declineButtonTxt }</button>
        </p>
    </div>
{/if}
