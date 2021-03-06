import axios from 'axios';

export async function getGifs(searchTopic, limit) {
  const giphyApiKey = process.env.REACT_APP_GIPHY_APIKEY;

  const { data } = await axios.get(`https://api.giphy.com/v1/gifs/search?q=${searchTopic}&limit=${limit}&api_key=${giphyApiKey}`);
  return data.data.map(gif => (
    { id: gif.id, 
      image: gif.images.fixed_height.url, // For display
      uploadUrl: gif.images.downsized.url, // For media upload - file size under 2MB
      title: gif.title }
  ));
}