import axios from 'axios';

export async function getTrends(num) {
  const { data } = await axios.get('/api/twitter/trends');
  return data.slice(0, num);
}

export function cleanName(name) {
  return name.replace(/^#/, '').replace(/([a-z](?=[A-Z]))/g, '$1 ').replace('_', ' ');
}