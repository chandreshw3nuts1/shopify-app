import settingsJson from './../utils/settings.json';
export  function getUploadDocument( fileName = "", shopId = "", folder = "") {
	try{

		if(fileName != "" && fileName != null) {
			let folderPath = `/uploads/${shopId}/`;
			if(folder !="") {
				folderPath = `${folderPath}${folder}/`;
			}
			if(fileName == 'default-banner.png') {
				return `${settingsJson.host_url}/app/images/${fileName}`;
			}
			return `${settingsJson.host_url}${folderPath}${fileName}`;
		}
		return null;
	} catch (error) {
		console.error('Error fetching  record :', error);
  	}
}

export function getDefaultProductImage() {
	return settingsJson.host_url+'/app/images/product-default.png';
}

