import axios from 'axios';

const translateTextGoogle = async (file, language) => {
  try {
    const formData = new FormData();

    formData.append('file', file)
    formData.append('language', language)

    const response = await axios.post('/.netlify/functions/api', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'arraybuffer',
    });

    return response

  } catch (error) {

    return { error: 'Translation error'}

  }
}

export default translateTextGoogle