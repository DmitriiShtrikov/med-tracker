// src/shared/api/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. ИНТЕРЦЕПТОР ЗАПРОСОВ (подставляем access token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. ИНТЕРЦЕПТОР ОТВЕТОВ (ловим 401 и обновляем токен)
api.interceptors.response.use(
  (response) => response, // Если ошибки нет — просто возвращаем ответ
  async (error) => {
    const originalRequest = error.config;

    // Если сервер вернул 401 (токен протух) и это не запрос на обновление и мы еще не пытались обновить
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/refresh') {
      originalRequest._retry = true; // Ставим флаг, чтобы не зациклиться

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('Нет refresh токена');
        }

        // Стучимся в эндпоинт обновления токена (используем обычный axios, а не наш api, чтобы не было рекурсии)
        const response = await axios.post('http://localhost:8000/api/refresh', {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token } = response.data;

        // Сохраняем новые токены
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        // Повторяем изначальный запрос с новым access токеном
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);

      } catch (refreshError) {
        // Если refresh токен тоже протух — удаляем всё и выкидываем на логин
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);