import axios from 'axios'

// Окремий екземпляр axios з базовою адресою та таймаутом
export const apiClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
})
