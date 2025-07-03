import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors, Fonts } from '@/constants/Colors';

export default function SettingsLayout() {
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          fontFamily: Fonts.semiBold,
          color: colors.textPrimary,
        },
        headerTintColor: colors.primary,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          headerTitle: 'Configurações',
          headerBackTitle: 'Voltar'
        }} 
      />
      <Stack.Screen 
        name="account" 
        options={{ 
          headerTitle: 'Conta',
          headerBackTitle: 'Voltar'
        }} 
      />
      <Stack.Screen 
        name="appearance" 
        options={{ 
          headerTitle: 'Aparência',
          headerBackTitle: 'Voltar'
        }} 
      />
      <Stack.Screen 
        name="business-profile" 
        options={{ 
          headerTitle: 'Perfil do Estabelecimento',
          headerBackTitle: 'Voltar'
        }} 
      />
      <Stack.Screen 
        name="notifications" 
        options={{ 
          headerTitle: 'Notificações',
          headerBackTitle: 'Voltar'
        }} 
      />
      <Stack.Screen 
        name="privacy" 
        options={{ 
          headerTitle: 'Privacidade',
          headerBackTitle: 'Voltar'
        }} 
      />
      <Stack.Screen 
        name="help" 
        options={{ 
          headerTitle: 'Ajuda',
          headerBackTitle: 'Voltar'
        }} 
      />
    </Stack>
  );
}