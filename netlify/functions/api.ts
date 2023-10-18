import busboy from 'busboy';
import { Handler } from '@netlify/functions';
import { TranslationServiceClient } from '@google-cloud/translate';

type Fields = {
    language: string,
    image: {
        filename: string;
        type: string;
        content: Buffer;
    }[];
    file: {
        filename: string;
        type: string;
        content: Buffer;
    }[];
};

const projectId = 'eighth-effect-259620'

async function quickStart(fileBuffer, language) {
    const credentials = {"type": "service_account", "project_id": "eighth-effect-259620","private_key_id": "16c06c8f9d4d8d7782ed7f97951f0970c7bc2fe6","private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCbWkqbCaACVOya\nRwoQC7pF5nHmVaIfi9S8pyFW28u2jFxN/QWzt1kGmEx3pUf+KOWbIXHHkgUBfQ8o\nvJnGA2nImHYs7/GBmXaJs8PDjZcHPb+NY56ro85kwvnjjzQpUro1nQFyLeXNcyuq\nOA/1QgmU8LBvx16gcN+8Rgd6b7SfQp0hZLenFpZzwBivh1d4i3E2RiPgCfn48EDp\n/g3q5NwQ0J3Xq1DdaXRlM41hG/rqGEkXbUpJ7wtOuPdyCqQlmsclCl8guVnO/WHr\ncE//Ttv8MKDm9L0e+WoK2bzecejB9TPVN0ptnz9EedzTmiAmyVzS8BqcUdHQf9Aj\nicfQEhABAgMBAAECggEAAe0OJLrrUWwVHNqJnOZQUmKHgfgI0QROSGJ4Dtgdv+8g\ni9T5t58ryuGjfQ4/BL8kDZbODs/YIQsYX4RrEaHkM1j0ih0VbOpmplFkuW1tdGkH\nEW0tP+qBeg1SxMf3ORXt+hEuvegkw7XMUklspTlC3iZXwaMCoNGVbIOfvxxYbGsF\njFsqHzI4IakJfhz0U/X23IdT+En+XbgqVK/5jixVqCduOs6svvpRcziuo/6602vu\nQxQATpQcgWIZNadmNLrIC6Wcmasmw++PzI/5RjtccOnvlrdHpirD3Xnz17oX1d6Z\nWYozbID1CfFsLav5tq4ELguWavABuDh1jy3xww/d2wKBgQDUNwJqET1ys4qmTDJy\ndTjYVQcOc/3y/0uq/r9e3pkxTO84smDj2MKfY4KE+Nx3stWVAdu+AL4N6s5HmG0W\n+keHiyqI6IplKKLix24iJvqhHXDFOYaDfH/uhBchi/XzvGTIlWFnF9ttmn993/3Y\nzvwIkdUBiX/K5s1LL9zMe9aucwKBgQC7Z+AGlFKn9qn6I4uUOPN//bOBTI0Am0R4\nqcUlJ73vnPDe2RJ7nwTnvcAzM6vMRBkOMYcHdLKeFMy5sgn7Z9Ls6nwJfRsgawQX\ncPV4S8MVIb33g5EVauP359yAAvKQXc5rhUtD/8lRxjCGnx8SXHSt39IDAp4luAQx\nkgAuNkJWuwKBgHW5XnmAvtnWh9/g/UtJhBNed9+osQQQY+WkFH2IdutGhp6pNd6v\n7KeHCGzDsWolpx5WPZSVzNjjnTNSd5H7nZqvtRTmC4A6nsG3aH1Bql+eeWSvmNNw\nSXgDhuFxRyvDIxWy6KnMLkoLHxaxH50ale4bGFMV9/KTPueq0Y4OVPXJAoGAKxid\nJQYw591Kg3JvI7vhCzrtb7uJ5WzPVyw7YOr9u7+MiMLEhFcySpSRQXUNeeDjHid3\nlNhaRw4jckSmFQFwOPlHYus5NMBHZZidaneJui9TPzsrPxCgsh7Iz0teOqLH2GQD\nxfRpeHuqJxsqiw9l6aJB6l1MvwHNPRUFI5tosAcCgYBpPbUXbaoqTlNYq9Kdu/jL\nJEsqWt6g4ks85udSnks0P0MyOHzaxtQibJTb/8F+8Whf0KPbRlrYmrCyD3LA/36W\nwidtdbaEFMKfNCOYPFDGxJ/27zgENZC1A0qa0rsL8//s/6k8hqDGnx1FwE91fBol\nPkas1enzCDwx7hoasCmm4Q==\n-----END PRIVATE KEY-----\n","client_email": "tradu-es-autom-ticas-magma@eighth-effect-259620.iam.gserviceaccount.com","client_id": "105775743828535680048","auth_uri": "https://accounts.google.com/o/oauth2/auth","token_uri": "https://oauth2.googleapis.com/token","auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/tradu-es-autom-ticas-magma%40eighth-effect-259620.iam.gserviceaccount.com"};

    if (!credentials) {
    throw new Error('As credenciais do Google Cloud Translation não estão definidas.');
    }
    const translationClient = new TranslationServiceClient({
        credentials,
    });

  const documentInputConfig = {
    content: fileBuffer,
    mimeType: 'application/pdf',
  };

  const request = {
    parent: `projects/${projectId}/locations/us-central1`,
    documentInputConfig,
    targetLanguageCode: language,
    isTranslateNativePdfOnly: true,
  };

  try {
    const [response] = await translationClient.translateDocument(request);
    let data

    if (response && response.documentTranslation && response.documentTranslation.byteStreamOutputs) {

        data = response.documentTranslation.byteStreamOutputs[0]

    }
    return data
    
  } catch (err) {
    console.error('Erro ao traduzir:', err);
    return
  }
}
function parseMultipartForm(event): Promise<Fields> {
    return new Promise((resolve) => {
        const fields = { image: [], file: [], language: '' };
        const bb = busboy({ headers: event.headers });

        bb.on('file', (name, file, info) => {
            const { filename, mimeType } = info;

            file.on('data', (data) => {
                if (!fields[name]) fields[name] = [];

                fields[name].push({
                    filename,
                    type: mimeType,
                    content: data,
                });
            });
        });

        bb.on('field', (name, value) => {
            fields[name] = value
        })

        bb.on('close', () => {
            resolve(fields);
        });

        bb.end(Buffer.from(event.body, 'base64'));
    });
}


export const handler: Handler = async (event) => {
    try {
        const fields = await parseMultipartForm(event);

        const language = fields.language;

        console.log('fields is: ', fields);
        console.log('image is: ', language);

        const file = fields.file[0];
        
        const data = await quickStart(file.content, language)   
        
        return {
            statusCode: 200,
            body: data.toString('base64'),
            isBase64Encoded: true,
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: error.toString(),
        };
    }
};