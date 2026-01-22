<script lang="ts">
  import { ScreenReaderOnly } from '@txstate-mws/svelte-components'
</script>

<svg style:display="none"></svg>
<span {...$$restProps} class="{$$restProps.class} loader" aria-hidden="false"><ScreenReaderOnly>loading</ScreenReaderOnly></span>

<style>
  .loader {
    width: 16px;
    height: 16px;
    border: 3px solid #FFF;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
