// const express = require('express');
// const { TranslationServiceClient } = require('@google-cloud/translate').v3;
// const serverless = require('serverless-http')
// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');
// const cors = require('cors');
// const router = express.Router()
// const app = express();
// require('dotenv').config();
// const { send } = require('micro');
// app.use(cors())

// const busboy = require('busboy');
// const { buffer } = require('micro');
// const { send } = require('micro');

// function parseMultipartForm(event) {
//     return new Promise((resolve) => {
//         const fields = { image: [] };
//         const bb = new busboy({ headers: event.headers });

//         bb.on('file', (name, file, info) => {
//             const { filename, mimeType } = info;

//             file.on('data', (data) => {
//                 if (!fields[name]) fields[name] = [];

//                 fields[name].push({
//                     filename,
//                     type: mimeType,
//                     content: data,
//                 });
//             });
//         });

//         bb.on('close', () => {
//             resolve(fields);
//         });

//         bb.end(Buffer.from(event.body, 'base64'));
//     });
// }

// module.exports = async (req, res) => {
//     try {
//         const fields = await parseMultipartForm(req);

//         if (!fields) {
//             throw new Error('Unable to parse image');
//         }

//         console.log('fields is: ', fields);
//         console.log('image is: ', fields.image);

//         const image = fields.image[0];

//         // Handle the image as needed...

//         send(res, 200, JSON.stringify(image));
//     } catch (error) {
//         send(res, 400, error.toString());
//     }
// };
// const port = 5000;
// const projectId = 'eighth-effect-259620';

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

router.post('/translate', upload.single('file'), async (req, res) => {
  try {
    const translationClient = new TranslationServiceClient({
      credentials: {
        "type": "service_account", 
        "project_id": "eighth-effect-259620",
        "private_key_id": "16c06c8f9d4d8d7782ed7f97951f0970c7bc2fe6",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCbWkqbCaACVOya\nRwoQC7pF5nHmVaIfi9S8pyFW28u2jFxN/QWzt1kGmEx3pUf+KOWbIXHHkgUBfQ8o\nvJnGA2nImHYs7/GBmXaJs8PDjZcHPb+NY56ro85kwvnjjzQpUro1nQFyLeXNcyuq\nOA/1QgmU8LBvx16gcN+8Rgd6b7SfQp0hZLenFpZzwBivh1d4i3E2RiPgCfn48EDp\n/g3q5NwQ0J3Xq1DdaXRlM41hG/rqGEkXbUpJ7wtOuPdyCqQlmsclCl8guVnO/WHr\ncE//Ttv8MKDm9L0e+WoK2bzecejB9TPVN0ptnz9EedzTmiAmyVzS8BqcUdHQf9Aj\nicfQEhABAgMBAAECggEAAe0OJLrrUWwVHNqJnOZQUmKHgfgI0QROSGJ4Dtgdv+8g\ni9T5t58ryuGjfQ4/BL8kDZbODs/YIQsYX4RrEaHkM1j0ih0VbOpmplFkuW1tdGkH\nEW0tP+qBeg1SxMf3ORXt+hEuvegkw7XMUklspTlC3iZXwaMCoNGVbIOfvxxYbGsF\njFsqHzI4IakJfhz0U/X23IdT+En+XbgqVK/5jixVqCduOs6svvpRcziuo/6602vu\nQxQATpQcgWIZNadmNLrIC6Wcmasmw++PzI/5RjtccOnvlrdHpirD3Xnz17oX1d6Z\nWYozbID1CfFsLav5tq4ELguWavABuDh1jy3xww/d2wKBgQDUNwJqET1ys4qmTDJy\ndTjYVQcOc/3y/0uq/r9e3pkxTO84smDj2MKfY4KE+Nx3stWVAdu+AL4N6s5HmG0W\n+keHiyqI6IplKKLix24iJvqhHXDFOYaDfH/uhBchi/XzvGTIlWFnF9ttmn993/3Y\nzvwIkdUBiX/K5s1LL9zMe9aucwKBgQC7Z+AGlFKn9qn6I4uUOPN//bOBTI0Am0R4\nqcUlJ73vnPDe2RJ7nwTnvcAzM6vMRBkOMYcHdLKeFMy5sgn7Z9Ls6nwJfRsgawQX\ncPV4S8MVIb33g5EVauP359yAAvKQXc5rhUtD/8lRxjCGnx8SXHSt39IDAp4luAQx\nkgAuNkJWuwKBgHW5XnmAvtnWh9/g/UtJhBNed9+osQQQY+WkFH2IdutGhp6pNd6v\n7KeHCGzDsWolpx5WPZSVzNjjnTNSd5H7nZqvtRTmC4A6nsG3aH1Bql+eeWSvmNNw\nSXgDhuFxRyvDIxWy6KnMLkoLHxaxH50ale4bGFMV9/KTPueq0Y4OVPXJAoGAKxid\nJQYw591Kg3JvI7vhCzrtb7uJ5WzPVyw7YOr9u7+MiMLEhFcySpSRQXUNeeDjHid3\nlNhaRw4jckSmFQFwOPlHYus5NMBHZZidaneJui9TPzsrPxCgsh7Iz0teOqLH2GQD\nxfRpeHuqJxsqiw9l6aJB6l1MvwHNPRUFI5tosAcCgYBpPbUXbaoqTlNYq9Kdu/jL\nJEsqWt6g4ks85udSnks0P0MyOHzaxtQibJTb/8F+8Whf0KPbRlrYmrCyD3LA/36W\nwidtdbaEFMKfNCOYPFDGxJ/27zgENZC1A0qa0rsL8//s/6k8hqDGnx1FwE91fBol\nPkas1enzCDwx7hoasCmm4Q==\n-----END PRIVATE KEY-----\n",
        "client_email": "tradu-es-autom-ticas-magma@eighth-effect-259620.iam.gserviceaccount.com",
        "client_id": "105775743828535680048",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/tradu-es-autom-ticas-magma%40eighth-effect-259620.iam.gserviceaccount.com"
    }
    });

    console.log(req.file);

    const targetLanguage = 'en'; // Defina o idioma de destino desejado

    const documentInputConfig = {
      content: req.file.buffer, // Usamos o buffer do arquivo enviado
      mimeType: 'application/pdf',
    };

    const request = {
      parent: `projects/${projectId}/locations/us-central1`,
      documentInputConfig,
      targetLanguageCode: targetLanguage,
    };

    const [response] = await translationClient.translateDocument(request);

    const data = response.documentTranslation.byteStreamOutputs[0]

    send(res, 200, data)

  } catch (err) {
    console.error('Erro ao traduzir:', err);
    send(res, 500, err)
  }

});

// app.use(`/.netlify/functions/api`, router);

// module.exports = app;
// module.exports.handler = serverless(app)

//refazer o bagui todo tirando os post e etc...
// Remove the 'express' import and 'app' initialization
// const multer = require('multer');
// const { buffer } = require('micro');
// const { send } = require('micro');

// // // Multer configuration
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // Define the Netlify function
// module.exports = upload.single('file')(async (req, res) => {
//   try {
//     const fileBuffer = await buffer(req);

//     const modifiedFile = fileBuffer;

//     send(res, 200, modifiedFile);
//   } catch (error) {
//     console.error(error);
//     send(res, 500, 'Internal Server Error');
//   }
// });]

// // Function to modify the file (replace this with your logic)
// function modifyFile(fileBuffer) {
//   // Implement your file modification logic here
//   // Example: Uppercase all content
//   const modifiedContent = fileBuffer.toString().toUpperCase();
//   return Buffer.from(modifiedContent);
// }