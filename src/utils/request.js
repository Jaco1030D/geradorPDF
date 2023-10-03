import {OpenAI} from 'openai'

const openaiApiKey = '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'; 

const translateText = async (text, languages) => {
  try {

    const openai = new OpenAI({
      apiKey: openaiApiKey,
      dangerouslyAllowBrowser: true
    });

    const translationPromises = languages.map(async (language) => {
      
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            "role": "system",
            "content": `Translate the following text to ${language}`
          },
          {
            "role": "user",
            "content": `${text}`
          }
        ],
        temperature: 0,
        max_tokens: 600,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      const translatedText = response.choices[0].message.content

    //   const response = await axios.post(

    //     openaiEndpoint,
    //     {
            
    //       prompt: `Translate the following text to ${language}: "${text}"`,
    //       max_tokens: 100,

    //     },
    //     {
    //       headers: {

    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${openaiApiKey}`,

    //       },
    //     }
    //   );

    //   const translatedText = response.data.choices[0]?.text.trim();

    //     // const translatedText = `${text} : ${language}`

      return { language: language, textTranslated: translatedText || 'Translation not available' };
    });

    const translationsArray = await Promise.all(translationPromises);

    return translationsArray;

  } catch (error) {

    return { error: 'Translation error' };

  }
};

export default translateText;