import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  User, 
  Bell, 
  Shield, 
  CircleHelp as HelpCircle, 
  ChevronRight,
  Star,
  LogOut,
  Palette
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors, Fonts } from '@/constants/Colors';

export default function SettingsScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  const settingsItems = [
    {
      icon: <User size={24} color={colors.textSecondary} />,
      title: 'Conta',
      subtitle: 'Gerenciar informações pessoais',
      onPress: () => router.push('/settings/account'),
    },
    {
      icon: <Palette size={24} color={colors.textSecondary} />,
      title: 'Aparência',
      subtitle: 'Tema claro, escuro ou automático',
      onPress: () => router.push('/settings/appearance'),
    },
    {
      icon: <Bell size={24} color={colors.textSecondary} />,
      title: 'Notificações',
      subtitle: 'Configurar alertas e lembretes',
      onPress: () => router.push('/settings/notifications'),
    },
    {
      icon: <Shield size={24} color={colors.textSecondary} />,
      title: 'Privacidade',
      subtitle: 'Controlar dados e privacidade',
      onPress: () => router.push('/settings/privacy'),
    },
    {
      icon: <HelpCircle size={24} color={colors.textSecondary} />,
      title: 'Ajuda',
      subtitle: 'Suporte e perguntas frequentes',
      onPress: () => router.push('/settings/help'),
    },
  ];

  const handleLogout = () => {
    router.replace('/welcome');
  };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background.secondary,
      paddingTop: Platform.OS === 'android' ? 25 : 0,
    },
    container: {
      flex: 1,
    },
    content: {
      padding: 16,
    },
    appInfoContainer: {
      alignItems: 'center',
      paddingVertical: 32,
      backgroundColor: colors.background.primary,
      borderRadius: 16,
      marginBottom: 24,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    appIconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    appName: {
      fontSize: 20,
      fontFamily: Fonts.bold,
      color: colors.textPrimary,
      marginBottom: 4,
    },
    appVersion: {
      fontSize: 14,
      color: colors.textSecondary,
      fontFamily: Fonts.regular,
    },
    menuContainer: {
      backgroundColor: colors.background.primary,
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 24,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lastMenuItem: {
      borderBottomWidth: 0,
    },
    menuIconContainer: {
      width: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    menuTextContainer: {
      flex: 1,
    },
    menuTitle: {
      fontSize: 16,
      fontFamily: Fonts.medium,
      color: colors.textPrimary,
      marginBottom: 2,
    },
    menuSubtitle: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: Fonts.regular,
    },
    logoutContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background.primary,
      borderRadius: 16,
      padding: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    logoutIconContainer: {
      width: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    logoutText: {
      fontSize: 16,
      fontFamily: Fonts.medium,
      color: colors.error,
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.appInfoContainer}>
            <View style={styles.appIconContainer}>
              <Star size={32} color={colors.primary} fill={colors.primary} />
            </View>
            <Text style={styles.appName}>MeetPoint</Text>
            <Text style={styles.appVersion}>Versão 1.0.0</Text>
          </View>

          <View style={styles.menuContainer}>
            {settingsItems.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.menuItem,
                  index === settingsItems.length - 1 && styles.lastMenuItem
                ]}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.menuIconContainer}>
                  {item.icon}
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <ChevronRight size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={styles.logoutContainer}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={styles.logoutIconContainer}>
              <LogOut size={24} color={colors.error} />
            </View>
            <Text style={styles.logoutText}>Sair da conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}