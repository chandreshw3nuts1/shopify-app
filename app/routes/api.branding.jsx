import { json } from "@remix-run/node";
import { findOneRecord } from "./../utils/common";

import fs from "fs";
import path from "path";
import generalAppearances from './../routes/models/generalAppearances';
// import ObjectId from 'bson-objectid';
import { Types } from 'mongoose';

export async function loader() {
    return json({
        name:"loading"
    });
}

export async function action({ params, request }) {
    const formData = await request.formData();

	const actionType = formData.get('actionType');

    const method = request.method;
    const shop = formData.get('shop_domain');

    const shopRecords = await findOneRecord("shop_details", { "shop": shop });
    switch (method) {
		case "POST":
			try {

				if(actionType == "uploadLogo") {
	                const validImageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
                    const logo = formData.get("logo");
					const uploadsDir = path.join(process.cwd(), "public/uploads/logo");
					fs.mkdirSync(uploadsDir, { recursive: true });
					const fileName = Date.now()+"-"+logo.name;
					
					const fileExtension = fileName.split('.').pop().toLowerCase();
                    if(validImageExtensions.includes(fileExtension)){
                        const filePath = path.join(uploadsDir, fileName);
                        const buffer = Buffer.from(await logo.arrayBuffer());
                        fs.writeFileSync(filePath, buffer);

                        const res = await generalAppearances.updateOne(
                            { shop_id: shopRecords._id },
                            {
                                $set: {
                                    shop_id: shopRecords._id,
                                    logo: fileName,
                                }
                            },
                            { upsert: true }
                        );
                        
					}
                    return json({"status" : 200, "message" : 'Setting saved'});

                }
            } catch (error) {
				console.error('Error updating record:', error);
				return json({ error: 'Failed to update record' }, { status: 500 });
			}
		case "DELETE":
            try {
                if(actionType == "deleteLogo") {

                    const logoData = await findOneRecord("general_appearances", { "shop_id": shopRecords._id });
                    const res = await generalAppearances.updateOne(
                        { shop_id: shopRecords._id },
                        {
                            $set: {
                                logo: null,
                            }
                        }
                    );


                    const deleteFileName = logoData.logo;
					const filePath = path.join(process.cwd(), "public/uploads/logo")+"/"+deleteFileName;
                    if (fs.existsSync(filePath)) {
                        try {
                            fs.unlinkSync(filePath);
                        } catch (error) {
                            console.error('Error deleting file:', error);
                        }
                    } else {
                        console.log('File does not exist:', filePath);
                    }
                    return json({"status" : 200, "message" : 'Setting saved'});

                }
            } catch (error) {
                console.error('Error updating record:', error);
                return json({ error: 'Failed to update record' }, { status: 500 });
            }
		default:

			return json({ "message": "", "method": "POST" });

	}
}