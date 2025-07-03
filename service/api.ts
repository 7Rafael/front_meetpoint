import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = await this.getAuthToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // ==================== AUTENTICAÇÃO ====================
  
  async loginCliente(email: string, senha: string) {
    const response = await this.makeRequest('/auth/cliente/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });
    
    if (response.token) {
      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('currentUser', JSON.stringify(response.user));
    }
    
    return response;
  }

  async loginEstabelecimento(email: string, senha: string) {
    const response = await this.makeRequest('/auth/estabelecimento/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });
    
    if (response.token) {
      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('currentUser', JSON.stringify(response.user));
    }
    
    return response;
  }

  async logout() {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('currentUser');
  }

  async getCurrentUser() {
    try {
      const userString = await AsyncStorage.getItem('currentUser');
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // ==================== ESTABELECIMENTOS ====================

  async getEstabelecimentos(categoria?: string, busca?: string) {
    const params = new URLSearchParams();
    if (categoria) params.append('categoria', categoria);
    if (busca) params.append('busca', busca);
    
    const queryString = params.toString();
    const endpoint = `/estabelecimentos${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(endpoint);
  }

  async getEstabelecimentoById(id: string) {
    return this.makeRequest(`/estabelecimentos/${id}`);
  }

  async createEstabelecimento(data: any) {
    return this.makeRequest('/estabelecimentos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEstabelecimento(id: string, data: any) {
    return this.makeRequest(`/estabelecimentos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getEstabelecimentoAvaliacoes(id: string) {
    return this.makeRequest(`/estabelecimentos/${id}/avaliacoes`);
  }

  async getEstabelecimentoEstatisticas(id: string) {
    return this.makeRequest(`/estabelecimentos/${id}/estatisticas`);
  }

  // ==================== CLIENTES ====================

  async createCliente(data: any) {
    return this.makeRequest('/clientes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCliente(id: string, data: any) {
    return this.makeRequest(`/clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getClienteAvaliacoes(id: string) {
    return this.makeRequest(`/clientes/${id}/avaliacoes`);
  }

  // ==================== AVALIAÇÕES ====================

  async getAvaliacoes(estabelecimentoId?: string, clienteId?: string) {
    const params = new URLSearchParams();
    if (estabelecimentoId) params.append('estabelecimento_id', estabelecimentoId);
    if (clienteId) params.append('cliente_id', clienteId);
    
    const queryString = params.toString();
    const endpoint = `/avaliacoes${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(endpoint);
  }

  async createAvaliacao(data: { estabelecimento_id: number; nota: number; comentario?: string }) {
    return this.makeRequest('/avaliacoes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAvaliacao(id: string, data: { nota?: number; comentario?: string }) {
    return this.makeRequest(`/avaliacoes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAvaliacao(id: string) {
    return this.makeRequest(`/avaliacoes/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();