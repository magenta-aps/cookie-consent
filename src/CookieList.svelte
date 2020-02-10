<script>

    import CookieSubList from './CookieSubList.svelte'

    export let data

</script>

<ul class="cc-list">
    {#each data as purpose, idx}
        <li class="cc-list-item">
            {#if typeof(purpose) === 'string'}
                { @html purpose }
            {:else}
                <CookieSubList data={purpose}/>
            {/if}
        </li>
    {/each}
</ul>