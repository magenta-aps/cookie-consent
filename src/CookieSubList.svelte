<script>

    const toggle = function() {
        toggle_state = !toggle_state
    }

    let toggle_state = false

    export let data

</script>

<div class="cc-multilevel-list cc-sublist-toggled-{ toggle_state}">
    <button class="cc-sublist-header" on:click={toggle}>{ @html data.general }</button>
    {#if toggle_state}
        <ul class="cc-sublist">
            {#each data.items as item}
                <li class="cc-sublist-item">{ @html item }</li>
            {/each}
        </ul>
    {/if}
</div>