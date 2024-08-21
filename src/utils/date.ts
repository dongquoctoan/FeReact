import moment from "moment";

export const formatDate = (date: any) => {
  return moment(date).format("HH:mm DD/MM/YYYY");
};
