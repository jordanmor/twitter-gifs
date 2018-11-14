import axios from 'axios';

export async function getTrends(num) {
  const { data } = await axios.get('/api/twitter/trends');
  return data.slice(0, num);
}