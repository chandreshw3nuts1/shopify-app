import axios from 'axios';

export async function axiosApis(method, url, data={}, headers) {
	try{
		
		if(!headers){
			console.log('data,headers');

			const headers = {
				'Content-Type': 'application/json'
			}
		}
		switch(method){
			case "GET":
				axios.get(url, {headers})
				.then((response) => {
					console.log(response);
				});

			case "POST":
				axios.post(url,data, {headers})
				.then((response) => {
					console.log(response);
					return  response.json();

				});
				return true;
			case "PUT":
				axios.put(url,data, {headers})
				.then((response) => {
					console.log(response);
				});
			case "PATCH":
				axios.patch(url,data, {headers})
				.then((response) => {
					console.log(response);
				});
			case "DELETE":
				axios.delete(url,data, {headers})
				.then((response) => {
					console.log(response);
				});
			default:
		}
		
	} catch (error) {
		console.error('Error fetching shop record by shop:', error);
  	}
}
