<script>
    export let data
</script>

<ul class="cc-list">
    {#each data as purpose}
        <li class="cc-list-item">
            {#if typeof(purpose) === 'string'}
                { @html purpose }
            {:else}
                <div>
                    { @html purpose.general }
                </div>
                <ul>
                    {#each purpose.items as item}
                        <li>{ @html item }</li>
                    {/each}
                </ul>
            {/if}
        </li>
    {/each}
</ul>