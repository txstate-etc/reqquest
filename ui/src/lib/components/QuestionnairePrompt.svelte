<script lang="ts">
    import { Button } from 'carbon-components-svelte'
    import Launch from 'carbon-icons-svelte/lib/Launch.svelte'

    /**
     * Array of external links to show above the form.
     * There can be up to 3 external links to help applicants if there are things they need to do externally to the app request.
     * @type {{ url: string, label: string }[]}
     */
    export let externalLinks: { url: string, label: string, target?: string, rel?: string }[] = []

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

    /**
     * Text alignment for the intro slot content. Defaults to the value of `align`.
     * @type {'left' | 'center' | 'right' | undefined}
     */
    export let introTextAlignment: 'left' | 'center' | 'right' | undefined = undefined

    $: effectiveIntroAlignment = introTextAlignment ?? align
</script>
{#if $$slots.intro}
    <div class="prompt-intro flow max-w-screen-md px-6" class:mx-auto={align === 'center'} class:text-center={effectiveIntroAlignment === 'center'} class:text-right={effectiveIntroAlignment === 'right'} style:color="var(--cds-text-02)">
        <slot name="intro" />
    </div>
{/if}
{#if externalLinks.length > 0}
    <div class="prompt-intro-links flow max-w-screen-md px-6" class:mx-auto={align === 'center'}>
        <ul class="flex gap-4 flex-wrap mb-4" class:justify-center={align === 'center'}>
        {#each externalLinks.slice(0, 3) as link (link.url)}
            <li><Button kind="ghost" icon={Launch} href={link.url} target={link.target ?? '_blank'} rel={link.rel ?? 'noopener noreferrer'}>{link.label}{#if (link.target ?? '_blank') === '_blank'}<span class="sr-only"> (opens in a new tab)</span>{/if}</Button></li>
        {/each}
        </ul>
    </div>
{/if}

<div class="px-6 prompt-form flow" class:max-w-screen-md={!fullWidth} class:w-full={fullWidth} class:mx-auto={align === 'center'}>
    <slot />
</div>
