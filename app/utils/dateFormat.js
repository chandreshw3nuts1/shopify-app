import { format, formatDistanceToNow } from 'date-fns';
import moment from 'moment';

export const formatDate = (date, formatDate= "yyyy-MM-dd") => {
  return format(new Date(date), formatDate);
};

export const formatTimeAgo = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const getCurrentDate = () => {
  return moment().utc().format('YYYY-MM-DD HH:mm:ss [UTC]');
};
