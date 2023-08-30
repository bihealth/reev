/**
 * Round `value` to `digits` and return an `<abbr>` tag that has the original value
 * as the `@title` and the rounded value as the inner text.  Optionally add a `label`
 * to the `@title`
 *
 * @param value  The value to use and round.
 * @param digits The number of digits to round to.
 * @param label  The optional label to add.
 */
export const roundIt = (value: number, digits: number = 2, label?: string): string => {
  if (!value) {
    return `<abbr title='${value}'>NaN</abbr>`
  }
  const roundedValue = value.toFixed(digits)
  const useLabel = label ? `${label}: ` : ''
  return `<abbr title="${useLabel}${value}">${roundedValue}</abbr>`
}
