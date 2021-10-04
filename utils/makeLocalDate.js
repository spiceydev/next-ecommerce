export const makeLocalDate = (date) =>
  new Intl.DateTimeFormat('en-NZ').format(new Date(date));
