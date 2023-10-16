const { TranslationServiceClient } = require('@google-cloud/translate').v3beta1;
const path = require('path')
const fs = require('fs')

process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, 'c.json');

const projectId = 'eighth-effect-259620'

async function quickStart() {

const translationClient = new TranslationServiceClient();

const filePath = 'pdf/arquivo.pdf';

const targetLanguage = 'en';

const document_content = fs.readFileSync(filePath);

const documentInputConfig = {
  content: document_content, 
  mimeType: 'application/pdf',
};


const request = {
  parent: `projects/${projectId}/locations/us-central1`,
  documentInputConfig,
  targetLanguageCode: targetLanguage,
};

try {
  const [response] = await translationClient.translateDocument(request);

  const outputFileName = 'pt-BR-machine translated.pdf';
  const outputFilePath = path.join(path.dirname(filePath), outputFileName);

  fs.writeFileSync(outputFilePath, response.documentTranslation.byteStreamOutputs[0]);
  console.log(`Tradução salva em: ${outputFilePath}`);
} catch (err) {
  console.error('Erro ao traduzir:', err);
}
}

quickStart();