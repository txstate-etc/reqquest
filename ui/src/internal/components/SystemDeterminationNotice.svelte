<script lang="ts">
  /**
   * Shown on the reviewer screen for a program with nothing to review: no PREAPPROVAL, APPROVAL,
   * ACCEPTANCE or workflow requirements. Its eligibility was decided by the system at submission.
   */
  export let programTitle: string
</script>

<section class="system-determination-notice">
  <h3>Nothing to review for {programTitle}</h3>
  <p>
    There are no remaining questions to answer for this program.<br>
    A system determination was made regarding the applicant's eligibility.
  </p>
</section>

<style>
  .system-determination-notice {
    background: var(--background-cool-light, #d6f1ff);
    padding: 1rem 1.5rem;
    margin-bottom: 0.5rem;
    text-align: center;
  }
  .system-determination-notice h3 {
    margin: 0 0 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.75rem;
    color: var(--cds-text-01, #161616);
  }
  .system-determination-notice p {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: var(--cds-text-02, #525252);
  }
</style>
