import React from 'react';
import { Tabs } from 'expo-router';
import { Chrome as Home, Star, User, ChartBar as BarChart3, MessageSquare } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { getColors, Fonts } from '@/constants/Colors';

export default function TabLayout() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const colors = getColors(isDark);
  const isBusinessUser = user?.type === 'estabelecimento';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: Fonts.medium,
        },
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingTop: 5,
          paddingBottom: 5,
          height: 60,
          backgroundColor: colors.background,
        },
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          fontFamily: Fonts.semiBold,
          color: colors.textPrimary,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: isBusinessUser ? 'Dashboard' : 'Início',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          headerTitle: isBusinessUser ? 'Dashboard do Negócio' : 'Estabelecimentos',
        }}
      />
      
      {isBusinessUser ? (
        <>
          <Tabs.Screen
            name="analytics"
            options={{
              title: 'Análises',
              tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} />,
              headerTitle: 'Análises e Relatórios',
            }}
          />
          <Tabs.Screen
            name="reviews"
            options={{
              title: 'Avaliações',
              tabBarIcon: ({ color, size }) => <MessageSquare color={color} size={size} />,
              headerTitle: 'Avaliações Recebidas',
            }}
          />
        </>
      ) : (
        <Tabs.Screen
          name="my-ratings"
          options={{
            title: 'Minhas Avaliações',
            tabBarIcon: ({ color, size }) => <Star color={color} size={size} />,
            headerTitle: 'Minhas Avaliações',
          }}
        />
      )}
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          headerTitle: 'Meu Perfil',
        }}
      />
      
      {/* Hide analytics and reviews tabs for customer users */}
      {!isBusinessUser && (
        <>
          <Tabs.Screen
            name="analytics"
            options={{
              href: null, // This hides the tab
            }}
          />
          <Tabs.Screen
            name="reviews"
            options={{
              href: null, // This hides the tab
            }}
          />
        </>
      )}
      
      {/* Hide my-ratings tab for business users */}
      {isBusinessUser && (
        <Tabs.Screen
          name="my-ratings"
          options={{
            href: null, // This hides the tab
          }}
        />
      )}
    </Tabs>
  );
}