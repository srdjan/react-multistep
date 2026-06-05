/**
 * The forward navigation gate, in one place. Returns the first index in
 * [from, to) that is not yet valid, or null when every step in that range is
 * valid. Backward moves never consult it (callers allow to <= from freely).
 *
 * Shared by goToStep (which enforces navigation and reports the blocking index
 * via onValidationError) and the a11y getStepProps disabled state, so the
 * button's appearance can never disagree with what navigation actually permits.
 */
export const firstBlockingStep = (
  from: number,
  to: number,
  isValidAt: (index: number) => boolean
): number | null => {
  for (let i = from; i < to; i += 1) {
    if (!isValidAt(i)) return i;
  }
  return null;
};
