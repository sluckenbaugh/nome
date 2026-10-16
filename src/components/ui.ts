/** Shared class strings for the flat, early-Mac control style. */

/**
 * Flat key: rounded rectangle with a 1px outline that inverts while pressed. Has no colours or
 * alignment, so variants don't fight over the same utilities. Combine with a face
 * (KEY_FACE / KEY_INVERTED / custom) and a justify-* class.
 */
export const KEY_BASE =
  'inline-flex select-none items-center rounded-[6px] border font-semibold uppercase tracking-wider transition-colors duration-75 ' +
  'active:border-line active:bg-ink active:text-panel ' +
  'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber disabled:pointer-events-none disabled:opacity-40'

/** Standard key colours. */
export const KEY_FACE = 'border-line bg-key text-ink'

/** Inverted colours: a key that is latched on (e.g. Drops enabled) or a pad on its beat. */
export const KEY_INVERTED = 'border-line bg-ink text-panel'

export const KEY = `${KEY_BASE} ${KEY_FACE} justify-center`

export const KEY_SM = `${KEY} h-9 min-w-9 px-2.5 text-sm`

/** Small uppercase control label. */
export const SILKSCREEN = 'text-[11px] font-bold uppercase tracking-[0.18em] text-ink-muted'
