import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { searchingQuery } from './queries-api';

const form = document.querySelector('.search-form');

form.addEventListener('submit', searchingQuery);
