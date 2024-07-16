import settingsJson from './../utils/settings.json';
export  function getUploadDocument( fileName = "", folder = "") {
	try{

		if(fileName != "" && fileName != null) {
			let folderPath = "uploads/";
			if(folder !="") {
				folderPath = "uploads/"+folder+"/";

			}
			if(fileName == 'default-banner.png') {
				return settingsJson.host_url+'/app/images/'+fileName;
			}
			return settingsJson.host_url+'/'+folderPath+fileName;
		}
		return null;
	} catch (error) {
		console.error('Error fetching  record :', error);
  	}
}

export function getDefaultProductImage() {
	return settingsJson.host_url+'/app/images/product-default.png';
}

