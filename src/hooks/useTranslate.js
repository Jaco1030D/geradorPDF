import jsPDF from 'jspdf'

import { pdfjs } from 'react-pdf';

import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

import translateText from '../utils/request';
import translateTextGoogle from '../utils/requestGoogle';

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const useTranslate = () => {

    const getTextFromPDF = async (FilePDF) => {
        return new Promise((resolve, reject) => {

            const reader = new FileReader();
        
            reader.onloadend = async function () {

              try {

                const typedArray = new Uint8Array(reader.result);

                const pdf = await pdfjs.getDocument(typedArray).promise;

                let fullText = '';
        
                for (let i = 1; i <= pdf.numPages; i++) {

                  const page = await pdf.getPage(i);

                  const content = await page.getTextContent();

                  fullText += content.items.map((s) => s.str).join(' ');

                }
        
                resolve(fullText);

              } catch (error) {

                reject(error);

              }

            };
        
            reader.readAsArrayBuffer(FilePDF);

          });

    }

    const getCountWord = (text) => {

        let countWords = text.trim().split(/\s+/).length

        return countWords

    }

    const getTranslatedText = async (text, languages) => {

      let TextTranslated = {}

      TextTranslated = await translateText(text, languages)

      console.log(TextTranslated);

      return TextTranslated

    }

    const TextForPDF = (text, name) => {

        const doc = new jsPDF()

        const addTextWithBreaks = (doc, text, x, y, pageHeight, margin) => {
          const lines = doc.splitTextToSize(text, doc.internal.pageSize.width - 2 * margin);
        
          let yOffset = y;
        
          lines.forEach(line => {
            const lineHeight = doc.getTextDimensions(line).h;
        
            if (yOffset + lineHeight > pageHeight - margin) {
              doc.addPage();
              yOffset = margin;
            }
        
            doc.text(line, x, yOffset);
            yOffset += lineHeight + 5; 
          });
        };
        
        const pageHeight = doc.internal.pageSize.height;
        const margin = 10;
        
        addTextWithBreaks(doc, text, margin, margin, pageHeight, margin);
        
        doc.save(name + '.pdf')
    }

    const codingLanguages = (languages) => {

      const languageCodeMapping = {
        'ingles': 'en',
        'espanhol': 'es',
        'frances': 'fr',
        'italiano': 'it',
        'portugues': 'pt',
      };

      const languageCodes = languages.map(language => {
        if (languageCodeMapping[language.toLowerCase()]) {
          return languageCodeMapping[language.toLowerCase()];
        } else {
          return language;
        }
      });
    
      return languageCodes;
    

    }

    const downloadPDF = async (namePDF, fileBuffer, language) =>{

      const blob = await new Blob([fileBuffer]);

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = namePDF + '-'+ language +'-.pdf';
      link.click();
      link.remove();
      
    }

    const translatePDFGoogle = async (FilePDF, namePDF, languages) => {

      let message = ''

      const res = await getTextFromPDF(FilePDF)

      const countWord = getCountWord(res)

      const languagesCoded = codingLanguages(languages)

      let response

      languagesCoded.forEach(async language => {
        
        response = await translateTextGoogle(FilePDF, language)

        await downloadPDF(namePDF, response.data, language)

      });


      return {
        countWord,
        message
      }

    }

    const translatePDF = async (FilePDF, languages, namePDF) => {

      let message = ''

      const res = await getTextFromPDF(FilePDF)

      const countWord = getCountWord(res)

      const texts = await getTranslatedText(res, languages)

      if (texts.error) {

         message = 'Algo deu errado... Tente novamente mais tarde'

      } else {

        texts.map((item) => {

          return TextForPDF(item.textTranslated, `${namePDF} - ${item.language}`)

        } )

        message = 'Seus PDFs estão sendo baixados... Agradeço por utilizar o nosso serviço'

      }


      return {
        countWord,
        message
      }

    }

    return {
        getCountWord,
        getTextFromPDF,
        getTranslatedText,
        TextForPDF,
        translatePDF,
        translatePDFGoogle,
        codingLanguages
    }
}