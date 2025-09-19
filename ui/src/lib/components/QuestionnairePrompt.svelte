<script lang="ts">
    import { Button } from 'carbon-components-svelte'
    import Launch from 'carbon-icons-svelte/lib/Launch.svelte'

    /**
     * Prompt title text. Can end in a period if it's a statement (e.g., "Review your personal information") or a question mark for questions (e.g., "Are you a veteran or dependent?").
     * @type {string}
     */
    export let title = ''

    /**
     * Explains details about the prompt.
     * @type {string}
     */
    export let description = ''

    /**
     * Whether or not this prompt is optional. If true, an 'Optional' label will be prepended to the description.
     * @type {boolean}
     */
    export let optional = false

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

<div class="prompt-intro flow max-w-screen-md mx-auto pt-10 px-6">
    <h2 class="font-medium text-xl text-center">{title}</h2>
    <p class="text-center"> {#if optional} <span>Optional. </span> {/if}  {description}</p>
    {#if externalLinks.length > 0}
        <ul class="flex gap-4 flex-wrap mb-4 justify-center">
        {#each externalLinks.slice(0, 3) as link}
            <li><Button kind="ghost" icon={Launch} href={link.url}>{link.label}</Button></li>
        {/each}
        </ul>
    {/if}
</div>

<div class="px-6 prompt-form flow" class:max-w-screen-md={!fullWidth} class:w-full={fullWidth} class:mx-auto={align === 'center'}>
    <slot />
</div>
