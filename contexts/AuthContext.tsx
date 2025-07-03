import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '@/service/api';

interface User {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  avatar?: string;
  type: 'cliente' | 'estabelecimento';
  cnpj?: string;
  endereco?: string;
  categoria?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, type: 'cliente' | 'estabelecimento') => Promise<void>;
  logout: () => Promise<void>;
  register: (data: any, type: 'cliente' | 'estabelecimento') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await ApiService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, type: 'cliente' | 'estabelecimento') => {
    try {
      let response;
      if (type === 'cliente') {
        response = await ApiService.loginCliente(email, password);
      } else {
        response = await ApiService.loginEstabelecimento(email, password);
      }
      
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await ApiService.logout();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const register = async (data: any, type: 'cliente' | 'estabelecimento') => {
    try {
      if (type === 'cliente') {
        await ApiService.createCliente(data);
      } else {
        await ApiService.createEstabelecimento(data);
      }
      
      // Auto login after registration
      await login(data.email, data.senha, type);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};