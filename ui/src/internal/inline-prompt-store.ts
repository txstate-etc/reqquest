import { FormStore } from '@txstate-mws/svelte-forms'

/**
 * FormStore for the inline autoSave reviewer prompts on /requests/[id]/approve/[programKey].
 * svelte-forms 2.1.8 fixed the dropped-trailing-autosave half of that bug 
 *
 * Sill need to prevent Form.svelte's reactToPreload calls store.preload whenever the
 * `preload` prop updates, and preload -> setData replaces state.data. Refresh
 * landing mid-typing reverts what the reviewer just typed still. Have to avoid by owning
 * the store and never passing `preload` in
 */
export class InlinePromptStore<StateType = Record<string, any>> extends FormStore<StateType> {
  /**
   * true once a real user edit has so the page must not preload over us after that. 
   * changedSinceSubmit/hasUnsavedChanges both clear on successful autosave, which is when a refresh could clobber the field.
   */
  touched = false
  /** true once Form's onDestroy has unmounted (and therefore reset) us - never reuse after this */
  discarded = false

  unmount () {
    this.discarded = true
    super.unmount()
  }

  async setField (path: string, val: any, opts?: { initialize?: boolean, notDirty?: boolean }) {
    // notDirty separates real user edits like setVal, and FieldRadio onUpdate from inner workings (reactToAllowedValues, handleConditionalData), which all pass notDirty: true
    if (!opts?.notDirty) this.touched = true
    return await super.setField(path, val, opts)
  }
}
