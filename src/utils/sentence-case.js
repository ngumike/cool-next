/* eslint-disable import/prefer-default-export */
export const sentenceCase = str => {
  const input = str ?? '';

  return input
    .toLowerCase()
    .toString()
    .replace(/(^|\. *)([a-z])/g, (match, separator, char) => separator + char.toUpperCase());
};
