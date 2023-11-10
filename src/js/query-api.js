import axios from 'axios';

export class QueryAPI {
  constructor() {
    this.q = '';
    this.page = 1;
    this.totalPage = 1;
  }

  async searchingQuery() {
    const instance = axios.create({
      baseURL: 'https://pixabay.com/api/',
      params: {
        key: '40576360-9430d89c95bcc602f8bad9bf3',
        q: this.q,
        page: this.page,
        per_page: 40,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });
    const resp = await instance.get();
    console.log(resp.data);
    return resp.data;
  }
}
