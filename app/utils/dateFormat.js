import { format, formatDistanceToNow } from 'date-fns';
import moment from 'moment-timezone';

export const formatDate = (date, formatDate = "yyyy-MM-dd") => {
	return format(new Date(date), formatDate);
};

export const formatTimeAgo = (date) => {
	return formatDistanceToNow(new Date(date), { addSuffix: true });
};


export const getCurrentDate = (timeZone) => {
	return moment().tz(timeZone).format('YYYY-MM-DDTHH:mm:ssZ');
};

export const getCustomFormattedEndDateTime = (daysToAdd = 0, timeZone) => {
	return moment().tz(timeZone).add(daysToAdd, 'days').format('YYYY-MM-DDT23:59:59Z');
};