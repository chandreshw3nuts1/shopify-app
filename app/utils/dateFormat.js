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

export const isValidDateFormat = (dateString) => {

	const regexOne = /^\d{2}-\d{2}-\d{4}$/;
	const regexTwo = /^\d{4}-\d{2}-\d{2}$/;
	if(regexOne.test(dateString)) {
		const parts = dateString.split('-');
		return `${parts[2]}-${parts[1]}-${parts[0]}`;
	} else if(regexTwo.test(dateString)) {
		return dateString;
	} else {
		const parts = dateString.split(' ');
		const firstParts = parts[0] || "";
		if(regexOne.test(firstParts)) {
			const parts = firstParts.split('-');
			return `${parts[2]}-${parts[1]}-${parts[0]}`;
		} else if(regexTwo.test(firstParts)) {
			return firstParts;
		}
	}
	
	return null;
}

/* returns name format for reviews*/
export function reviewersNameFormat(firstName = "", lastName = "", format = "default") {
	switch (format) {
	  case "default":
		return `${firstName} ${lastName.charAt(0)}.`;
		
	  case "fn":
		return firstName;
		
	  case "ln":
		return lastName;
		
	  case "initial":
		return `${firstName.charAt(0)}. ${lastName.charAt(0)}.`;
		
	  default:
		return `${firstName} ${lastName}`;
	}
  }