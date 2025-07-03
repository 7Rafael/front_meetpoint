import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors } from '@/constants/Colors';

export default function AuthLayout() {
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background.primary,
        },
        headerTitleStyle: {
          fontWeight: '600',
          color: colors.text.primary,
        },
        headerTintColor: colors.primary,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name="register-type" 
        options={{ 
          headerTitle: 'Tipo de Cadastro',
          headerBackTitle: 'Voltar'
        }} 
      />
      <Stack.Screen 
        name="register-customer" 
        options={{ 
          headerTitle: 'Cadastro de Cliente',
          headerBackTitle: 'Voltar'
        }} 
      />
      <Stack.Screen 
        name="register-business" 
        options={{ 
          headerTitle: 'Cadastro de Estabelecimento',
          headerBackTitle: 'Voltar'
        }} 
      />
      <Stack.Screen 
        name="login" 
        options={{ 
          headerTitle: 'Entrar',
          headerBackTitle: 'Voltar'
        }} 
      />
    </Stack>
  );
}