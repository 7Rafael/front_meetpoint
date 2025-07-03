// api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Altere para o IP da máquina se for testar no celular físico
  timeout: 10000,
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== ESTABELECIMENTOS ====================

export const getEstablishments = async () => {
  const response = await api.get('/estabelecimentos');
  return response.data;
};

export const getEstablishmentById = async (id: string) => {
  const response = await api.get(`/estabelecimento/${id}`);
  return response.data;
};

// ==================== AVALIAÇÕES ====================

export const getEstablishmentRatings = async (establishmentId: string) => {
  const response = await api.get(`/estabelecimentos/${establishmentId}/avaliacoes`);
  return response.data;
};

export const createRating = async (data: {
  texto?: string;
  cliente_id: string;
  estabelecimento_id: string;
  tipo_id: string;
  comentario_id?: string;
  nota: number;
}) => {
  const response = await api.post('/avaliacoes', data);
  return response.data;
};

// ==================== AUTENTICAÇÃO ====================

export const loginUser = async (
  email: string,
  password: string,
  type: 'client' | 'establishment'
) => {
  const endpoint = type === 'client' ? '/clientes/login' : '/estabelecimentos/login';
  const response = await api.post(endpoint, { email, senha: password });
  return response.data;
};

export const registerUser = async (
  data: any,
  type: 'client' | 'establishment'
) => {
  const endpoint = type === 'client' ? '/clientes' : '/estabelecimentos';
  const response = await api.post(endpoint, data);
  return response.data;
};

// ==================== CLIENTES ====================

export const getClientes = async () => {
  const response = await api.get('/clientes');
  return response.data;
};

export const getClienteById = async (id: string) => {
  const response = await api.get(`/clientes/${id}`);
  return response.data;
};

export const getUserRatings = async (userId: string) => {
  const response = await api.get(`/clientes/${userId}/avaliacoes`);
  return response.data;
};

// ==================== EXPORT ====================

export default api;