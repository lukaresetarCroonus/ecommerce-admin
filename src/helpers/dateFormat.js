export const formatDate = (date) => {
  if (date === null) return date;
  let format = new Date(date);
  if (isNaN(format.valueOf())) {
    return date;
  }
  return format.toDateString();
};

export const formatDateTime = (datetime) => {
  if (datetime === null) return datetime;
  let format = new Date(datetime);
  if (isNaN(format.valueOf())) {
    return datetime;
  }
  return format.toUTCString();
};
