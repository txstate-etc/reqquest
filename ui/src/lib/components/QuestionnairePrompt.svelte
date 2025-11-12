<script lang="ts">
    import { Button } from 'carbon-components-svelte'
    import Launch from 'carbon-icons-svelte/lib/Launch.svelte'

    /**
     * Array of external links to show above the form.
     * There can be up to 3 external links to help applicants if there are things they need to do externally to the app request.
     * @type {{ url: string, label: string }[]}
     */
    export let externalLinks: { url: string, label: string }[] = []

    /**
     * If true, the form will take the full width of its container. If false, it will be constrained to max-w-screen-md.
     * @type {boolean}
     */
    export let fullWidth = false

    /**
     * Alignment of the form container. 'center' will center it and 'left' will align it to the left.
     * @type {'left' | 'center'}
     */
    export let align: 'left' | 'center' = 'center'
</script>
{#if externalLinks.length > 0}
    <div class="prompt-intro-links flow max-w-screen-md mx-auto px-6">
        <ul class="flex gap-4 flex-wrap mb-4 justify-center">
        {#each externalLinks.slice(0, 3) as link (link.url)}
            <li><Button kind="ghost" icon={Launch} href={link.url}>{link.label}</Button></li>
        {/each}
        </ul>
    </div>
{/if}

<div class="px-6 prompt-form flow" class:max-w-screen-md={!fullWidth} class:w-full={fullWidth} class:mx-auto={align === 'center'}>
    <slot />
</div>
