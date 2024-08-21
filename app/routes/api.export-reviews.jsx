import { json } from '@remix-run/node';
import { findOneRecord } from "./../utils/common";
import productReviews from "./models/productReviews";
import settingsJson from "./../utils/settings.json";

export const loader = async () => {

};

export async function action({ request }) {

	const requestBody = await request.json();

	const method = request.method;

	switch (method) {
		case "POST":
			var { shop, actionType } = requestBody;
			try {
				const shopRecords = await findOneRecord("shop_details", { "shop": shop });
				if (actionType == 'exportReviews') {
					const query = {
						"shop_id": shopRecords._id
					};

					const domainPrefix = `${settingsJson.host_url}/uploads/`;

					const reviewItems = await productReviews.aggregate([
						{
						  $match: query
						},
						{
						  $lookup: {
							from: 'review_documents',
							localField: '_id',
							foreignField: 'review_id',
							as: 'reviewDocuments'
						  }
						},
						{
						  $unwind: {
							path: "$reviewDocuments",
							preserveNullAndEmptyArrays: true
						  }
						},
						{
						  $group: {
							_id: "$_id",
							rating: { $first: "$rating" },
							status: { $first: "$status" },
							date: { $first: { $dateToString: { format: "%Y-%m-%dT%H:%M:%S.%LZ", date: "$createdAt" } } },
							first_name: { $first: "$first_name" },
							last_name: { $first: "$last_name" },
							display_name: { $first: "$display_name" },
							email: { $first: "$email" },
							product_id: { $first: "$product_id" },
							product_title: { $first: "$product_title" },
							product_handle: { $first: "$product_url" },
							variant_title: { $first: "$variant_title" },
							review_description: { $first: "$description" },
							reply_text: { $first: "$replyText" },
							verified_purchase: { $first: "$verify_badge" },
							reviewDocuments: {
							  $push: { $concat: [domainPrefix, "$reviewDocuments.url"] }
							}
						  }
						},
						{
						  $sort: { date: -1 } // Sort after matching
						},
						{
						  $project: {
							_id: 1,
							rating: 1,
							status: 1,
							date: 1,
							first_name: 1,
							last_name: 1,
							display_name: 1,
							email: 1,
							product_id: 1,
							product_title: 1,
							product_handle: 1,
							variant_title: 1,
							review_description: 1,
							reply_text: 1,
							verified_purchase: 1,
							review_documents: {
							  $reduce: {
								input: "$reviewDocuments",
								initialValue: "",
								in: {
								  $cond: {
									if: { $eq: ["$$value", ""] },
									then: "$$this",
									else: { $concat: ["$$value", ",", "$$this"] }
								  }
								}
							  }
							}
						  }
						}
					  ]);
					  
					//return reviewItems;
					const csvData = convertToCSV(reviewItems);
					return new Response(csvData, {
						headers: {
							'Content-Type': 'text/csv',
						},
					});
				}

			} catch (error) {
				console.log(error);
				return json({ "status": 400, "message": "Operation failed" });
			}
		default:

			return json({ "message": "", "method": "POST" });

	}
}
function convertToCSV(data) {
	// Determine which keys to include in the CSV
	const headers = Object.keys(data[0]).filter(key => key !== '_id');
	
	const escapeCSVValue = (value) => {
	  if (value == null) return ''; // Handle null or undefined
	  const strValue = String(value);
	  if (strValue.includes(',') || strValue.includes('\n') || strValue.includes('"')) {
		return `"${strValue.replace(/"/g, '""')}"`; // Escape double quotes
	  }
	  return strValue;
	};
  
	const rows = data.map(row =>
	  headers.map(fieldName => escapeCSVValue(row[fieldName])).join(',')
	);
  
	return [headers.join(','), ...rows].join('\n');
  }
  