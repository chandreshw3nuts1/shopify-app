import { json } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import multer from 'multer';
import { createRequestHandler } from '@remix-run/express';
import express from 'express';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('storage');

    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    console.log('storage==============');

    cb(null, file.originalname);
  }
});
//console.log('==========================');
//console.log(storage);
const upload = multer({ storage: storage });

const app = express();

app.use(upload.single('file'));

app.all('*', createRequestHandler({
  getLoadContext() {
    return { message: "Hello from the upload route!" };
  }
}));

export const action = async ({ request }) => {
  const data = await request.formData();
  console.log(data);
  const file = data.get('file');

  if (!file) {
    return json({ error: 'No file uploaded' }, { status: 400 });
  }

  const filePath = `uploads/${file.name}`;
  // Here you can move or handle the uploaded file as needed

  return json({ filePath });
};  