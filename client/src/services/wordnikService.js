import axios from 'axios';

export async function getRandomWords(limit) {
  const wordnikApiKey = process.env.REACT_APP_WORDNIK_APIKEY;
  const response = await axios.get(`https://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&limit=${limit}&api_key=${wordnikApiKey}`);
  if(response.status === 200) {
    const { data } = response;
    return data;
  } else {
    return;
  }
}