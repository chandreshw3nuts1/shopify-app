import { format, formatDistanceToNow } from 'date-fns';
import moment from 'moment-timezone';

export const formatDate = (date, timeZone = "Asia/Kolkata", formatDate = "YYYY-MM-DD") => {
	return moment(date).tz(timeZone).format(formatDate);
};


export const formatTimeAgo = (date, timeZone = "Asia/Kolkata") => {
	const momentDate = moment(date).tz(timeZone);
	const now = moment().tz(timeZone);

	if (momentDate.isSame(now.subtract(1, 'day'), 'day')) {
        return 'Yesterday';
    } else {
        return momentDate.fromNow();
    }
};

export const getCurrentDate = (timeZone) => {
	return moment().tz(timeZone).format('YYYY-MM-DDTHH:mm:ssZ');
};

export const getCustomFormattedEndDateTime = (daysToAdd = 0, timeZone) => {
	return moment().tz(timeZone).add(daysToAdd, 'days').format('YYYY-MM-DDT23:59:59Z');
};

export const addDaysToDate = (date, daysToAdd = 0, timeZone, formatDate = "YYYY-MM-DD") => {
	return moment(date).tz(timeZone).add(daysToAdd, 'days').format(formatDate);
};