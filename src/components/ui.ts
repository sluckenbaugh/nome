/** Shared class strings for the hardware look. */

/**
 * Raised hardware key shape and press behaviour, without colours or alignment so variants don't
 * fight over the same utilities. Combine with KEY_FACE (or another face) and a justify-* class.
 */
export const KEY_BASE =
  'inline-flex select-none items-center rounded-[5px] border font-semibold uppercase tracking-wider ' +
  'shadow-[0_2px_0_var(--color-key-edge),0_3px_5px_rgb(0_0_0/0.15)] transition-[transform,box-shadow,background-color] duration-75 ' +
  'active:translate-y-[2px] active:shadow-[0_0_0_var(--color-key-edge),0_1px_2px_rgb(0_0_0/0.15)] ' +
  'outline-none focus-visible:ring-2 focus-visible:ring-amber disabled:pointer-events-none disabled:opacity-40'

/** Standard key colours. */
export const KEY_FACE = 'border-rule bg-key text-ink'

export const KEY = `${KEY_BASE} ${KEY_FACE} justify-center`

/** A key held down (latched), e.g. while playing. */
export const KEY_LATCHED = 'translate-y-[2px] shadow-[0_0_0_var(--color-key-edge),0_1px_2px_rgb(0_0_0/0.15)]'

export const KEY_SM = `${KEY} h-9 min-w-9 px-2.5 text-sm`

/** Small printed panel label ("silkscreen"). */
export const SILKSCREEN = 'text-[11px] font-bold uppercase tracking-[0.18em] text-ink-muted'
