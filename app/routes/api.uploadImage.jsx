import { Form, useSubmit } from "@remix-run/react";

import {
  json,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createFileUploadHandler as createFileUploadHandler,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";


// Action function to handle file upload logic
export async function action({ params, request }) {
  const uploadHandler =  composeUploadHandlers(
    createFileUploadHandler({
      directory: "public/uploads",
      maxPartSize: 300000000,
    }),
    createMemoryUploadHandler(),
  );
  const formData = await parseMultipartFormData(request, uploadHandler);
  // console.log(formData);
  // const image = formData.get("file");
  // if (!image || typeof image === "string") {
  //   return json({ error: "something wrong", imgSrc: null });
  // }


  return json({ status: false, message: "Please provide valid user data." });
};