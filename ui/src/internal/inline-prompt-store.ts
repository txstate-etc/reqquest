import { FormStore, type Feedback } from '@txstate-mws/svelte-forms'

/**
 * This implemented specifically to handle the trailing issue that was identified in va-cert bug: https://github.com/txstate-etc/va-certification/issues/360
 * FormStore for the inline autoSave reviewer prompts on /requests/[id]/approve/[programKey].
 *
 * FormStore.submit() coalesces onto an in-flight mutation: this.submitPromise ??= this.submitFn(dataToSubmit)
 * Once an updatePrompt round trip takes longer than the debounce timer, the next autosave adopts the previous mutation's response
 * instead of sending its own. It shows success, then sets beforeUserChanges to a snapshot it never sent, and leaves the debounce timer cleared
 * (submit() clears it on entry and nothing re-arms it) - so trailing keystrokes are never persisted and hasUnsavedChanges falsely reads false
 * which lets the next preload() from invalidateAll() overwrite them. Serializing submits means every snapshot is actually sent.
 */
export class InlinePromptStore<StateType = Record<string, any>> extends FormStore<StateType> {
  /** true once a real user edit has landed; the page must not preload over us after that */
  touched = false
  /** true once Form's onDestroy has unmounted (and therefore reset) us - never reuse after this */
  discarded = false
  private chain: Promise<unknown> = Promise.resolve()

  unmount () {
    this.discarded = true
    super.unmount()
  }

  async setField (path: string, val: any, opts?: { initialize?: boolean, notDirty?: boolean }) {
    // notDirty separates real user edits like setVal, and FieldRadio onUpdate from inner workings (reactToAllowedValues, handleConditionalData), which all pass notDirty: true
    if (!opts?.notDirty) this.touched = true
    return await super.setField(path, val, opts)
  }

  async submit (opts?: { autoSave?: boolean }): Promise<{ data: StateType, success: boolean, messages: Feedback[] }> {
    // chain resolves only after super.submit's finally has cleared submitPromise, so the next submit is guaranteed to send its own mutation rather than adopting
    const run = this.chain.then(async () => await super.submit(opts))
    this.chain = run.catch(() => {})
    return await run
  }
}
