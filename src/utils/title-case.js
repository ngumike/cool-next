/* eslint-disable import/prefer-default-export */
export const titleCase = str => (str ? str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase()) : '');
