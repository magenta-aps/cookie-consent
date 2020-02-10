<!-- Copyright (C) 2019 Magenta ApS, http://magenta.dk.
   - Contact: info@magenta.dk.
   -
   - This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->


<script>

    import { fly } from 'svelte/transition'
    import { consent, config } from './CCStore.js'
    import { sayYes, sayNo, dispatch, setConsent, ev_give, ev_decline } from './CCMixins.js'
    import CookieList from './CookieList.svelte';

	// Data
	let toggle = false

    // Methods
    function sayYesAgain() {
        toggleConsentEdit()
        sayYes()
    }
    function sayNoAgain() {
        toggleConsentEdit()
        sayNo()
    }
	function toggleConsentEdit() {
		toggle = !toggle
	}
	
</script>


{#if $consent !== null && !toggle }
    <p class="cc-toggle" role="status" aria-live="assertive">
        Cookies { $consent ? $config.messages.acceptedTxt : $config.messages.declinedTxt } 
        <button on:click={ toggleConsentEdit } class="cc-toggle-btn">{ $config.messages.editConsent }</button>
    </p>
{/if}

{#if $consent !== null && toggle }
    <div class="cc-revise-diag" 
         role="alertdialog" 
         aria-live="assertive" 
         aria-labelledby="revise-consent-title"
         transition:fly="{{ y: 300, duration: 300 }}">
        <button class="cc-close" title="{ $config.messages.revisionCloseDiag }" aria-label="{ $config.messages.revisionCloseDiag }" on:click={ toggleConsentEdit }></button>
        {#if $consent}
            <h2 id="revise-consent-title" class="cc-title">{ $config.messages.revisionTitleAccepted }</h2>
            <p class="cc-additional">{ @html $config.messages.additionalInfo }</p>
            <CookieList data={$config.messages.purposes}/>
            <p class="cc-ask-again">{ $config.messages.revisionAskToDecline }</p>
            <p class="cc-actions">
                <button aria-controls="cookie-consent-diag" on:click={ sayNoAgain } class="cc-decline">{ $config.messages.revisionDeclineAction }</button>
            </p>
        {:else}
            <h2 id="revise-consent-title" class="cc-title">{ $config.messages.revisionTitleDeclined }</h2>
            <p class="cc-additional">{ @html $config.messages.additionalInfo }</p>
            <CookieList data={$config.messages.purposes}/>
            <p class="cc-ask-again">{ $config.messages.revisionAskToAccept }</p>
            <p class="cc-actions">
                <button aria-controls="cookie-consent-diag" on:click={ sayYesAgain } class="cc-accept">{ $config.messages.acceptButtonTxt }</button>
            </p>
        {/if}
    </div>
{/if}
