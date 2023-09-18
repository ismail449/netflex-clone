export const validateEmail = (email: string) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

export const formatDate = (date: string) => {
  const newDate = new Date(date);
  let minute = "" + newDate.getMinutes();
  let hour = "" + newDate.getHours();
  let month = "" + (newDate.getMonth() + 1);
  let day = "" + newDate.getDate();
  const year = newDate.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  if (hour.length < 2) hour = "0" + hour;
  if (minute.length < 2) minute = "0" + minute;

  return `${year}-${month}-${day} ${hour}:${minute}`;
};
