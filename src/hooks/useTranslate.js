import jsPDF from 'jspdf'

import { pdfjs } from 'react-pdf';

import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

import translateText from '../utils/request';
import translateTextGoogle from '../utils/requestGoogle';

import {PDFDocument} from 'pdf-lib'

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

    const numsArray = (initial, num) => {
      const values = [];

      for (let i = initial; i <= num; i++) {
        values.push(i);
      }

      return values
    }

    const splitPagesPDF = async (FilePDF) => {
      return new Promise((resolve, reject) => {

        const reader = new FileReader();
    
        reader.onloadend = async function () {

          try {

            const typedArray = new Uint8Array(reader.result);

            const pdf = await PDFDocument.load(typedArray);

            const numPages = pdf.getPageCount();

            const middlePage = Math.ceil(numPages / 2);

            const firstHalfPdf = await PDFDocument.create();
            
            const firstHalfPagesNum = numsArray(0, middlePage - 1)
            
            const firstHalfPages = await firstHalfPdf.copyPages(pdf, firstHalfPagesNum);

            firstHalfPages.forEach((page) => {
            
              firstHalfPdf.addPage(page);
            
            });

            const secondHalfPdf = await PDFDocument.create();

            const secondHalfPagesNum = numsArray(middlePage, numPages - 1)

            const secondHalfPages = await secondHalfPdf.copyPages(pdf, secondHalfPagesNum);


            secondHalfPages.forEach((page) => {

              secondHalfPdf.addPage(page);
            
            });

            const first = await firstHalfPdf.save();

            const second = await secondHalfPdf.save();

            resolve({first, second})

          } catch (error) {

            reject(error);

          }

        };
    
        reader.readAsArrayBuffer(FilePDF);

      });
    } 
    

    const halfPdf = async (FilePdf) => {

      const res = await splitPagesPDF(FilePdf)

      const first = res.first

      const second = res.second

      const pdfBlob1 = new Blob([first], { type: 'application/pdf' });

      const pdfFile1 = new File([pdfBlob1], 'nome_do_arquivo.pdf', { type: 'application/pdf' });

      const pdfBlob2 = new Blob([second], { type: 'application/pdf' });

      const pdfFile2 = new File([pdfBlob2], 'nome_do_arquivo.pdf', { type: 'application/pdf' });

      console.log(pdfFile1, pdfFile2);

      downloadPDF('teste', first , 'parte1')
      
      downloadPDF('teste', second , 'parte2')

      const {mergedPdfBytes} = await mergePDF(first, second)

      downloadPDF('pdfcompleto', mergedPdfBytes, 'completão')

    }

    const mergePDF = async (pdf1, pdf2) => {
      try {

        const pdfDoc1 = await PDFDocument.load(pdf1);
        
        const pdfDoc2 = await PDFDocument.load(pdf2);

        const mergedPdf = await PDFDocument.create();

        const copiedPages1 = await mergedPdf.copyPages(pdfDoc1, pdfDoc1.getPageIndices());
        copiedPages1.forEach((page) => {
          mergedPdf.addPage(page);
        });

        const copiedPages2 = await mergedPdf.copyPages(pdfDoc2, pdfDoc2.getPageIndices());
        copiedPages2.forEach((page) => {
          mergedPdf.addPage(page);
        })

        const mergedPdfBytes = await mergedPdf.save();

        return {mergedPdfBytes};
      
      } catch (error) {
        
        console.log(error);

      }
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
      link.href = await URL.createObjectURL(blob);
      link.download = namePDF + '-'+ language +'-.pdf';
      link.click();
      link.remove();
      
    }

    const translatePDFGoogle = async (FilePDF, namePDF, languages) => {

      let message = ''

      const res = await getTextFromPDF(FilePDF)

      const countWord = getCountWord(res)

      const {first, second} = await splitPagesPDF(FilePDF)

      const pdfBlob1 = new Blob([first], { type: 'application/pdf' });

      const pdfFile1 = new File([pdfBlob1], 'first.pdf', { type: 'application/pdf' });

      const pdfBlob2 = new Blob([second], { type: 'application/pdf' });

      const pdfFile2 = new File([pdfBlob2], 'second.pdf', { type: 'application/pdf' });


      const languagesCoded = codingLanguages(languages)

      let responseArchive1

      let responseArchive2

      languagesCoded.forEach(async language =>  {

        responseArchive1 = await translateTextGoogle(pdfFile1, language)

        console.log(responseArchive1);
        
        responseArchive2 = await translateTextGoogle(pdfFile2, language)

        const { mergedPdfBytes } = await mergePDF(responseArchive1.data, responseArchive2.data)

        downloadPDF(namePDF, mergedPdfBytes , language)
        
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
        codingLanguages,
        halfPdf
    }
}