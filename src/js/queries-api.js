import axios from 'axios';

export async function searchingQuery(e) {
  e.preventDefault();
  const searchInput = document.querySelector('input');
  const instance = axios.create({
    baseURL: 'https://pixabay.com/api/',
    params: {
      key: '40576360-9430d89c95bcc602f8bad9bf3',
      q: `${searchInput.value}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    },
  });
  const resp = await instance.get();
  console.log(resp.data);
}
