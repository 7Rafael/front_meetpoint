import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut, Star, Settings, Bell, Shield, CircleHelp as HelpCircle, Store } from 'lucide-react-native';
import Button from '@/components/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors, Fonts } from '@/constants/Colors';
import { getCurrentUser, getUserRatings, getBusinessEstablishment } from '@/utils/mockData';

export default function ProfileScreen() {
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const router = useRouter();
  const currentUser = getCurrentUser();
  const userRatings = getUserRatings(currentUser.id);
  const isBusinessUser = currentUser.type === 'business';
  const establishment = isBusinessUser && currentUser.businessId 
    ? getBusinessEstablishment(currentUser.businessId) 
    : null;

  const handleLogout = () => {
    router.replace('/welcome');
  };

  const businessMenuItems = [
    { 
      icon: <Store size={24} color={colors.textSecondary} />, 
      title: 'Perfil do Estabelecimento', 
      subtitle: 'Editar informações do negócio',
      onPress: () => router.push('/settings/business-profile')
    },
    { 
      icon: <Settings size={24} color={colors.textSecondary} />, 
      title: 'Configurações', 
      subtitle: 'Preferências, notificações e privacidade',
      onPress: () => router.push('/settings')
    },
    { 
      icon: <Bell size={24} color={colors.textSecondary} />, 
      title: 'Notificações', 
      subtitle: 'Gerenciar notificações do aplicativo',
      onPress: () => router.push('/settings/notifications')
    },
    { 
      icon: <Shield size={24} color={colors.textSecondary} />, 
      title: 'Privacidade', 
      subtitle: 'Controle seus dados e privacidade',
      onPress: () => router.push('/settings/privacy')
    },
    { 
      icon: <HelpCircle size={24} color={colors.textSecondary} />, 
      title: 'Ajuda', 
      subtitle: 'Perguntas frequentes e suporte',
      onPress: () => router.push('/settings/help')
    },
  ];

  const customerMenuItems = [
    { 
      icon: <Settings size={24} color={colors.textSecondary} />, 
      title: 'Configurações', 
      subtitle: 'Preferências, notificações e privacidade',
      onPress: () => router.push('/settings')
    },
    { 
      icon: <Bell size={24} color={colors.textSecondary} />, 
      title: 'Notificações', 
      subtitle: 'Gerenciar notificações do aplicativo',
      onPress: () => router.push('/settings/notifications')
    },
    { 
      icon: <Shield size={24} color={colors.textSecondary} />, 
      title: 'Privacidade', 
      subtitle: 'Controle seus dados e privacidade',
      onPress: () => router.push('/settings/privacy')
    },
    { 
      icon: <HelpCircle size={24} color={colors.textSecondary} />, 
      title: 'Ajuda', 
      subtitle: 'Perguntas frequentes e suporte',
      onPress: () => router.push('/settings/help')
    },
  ];

  const menuItems = isBusinessUser ? businessMenuItems : customerMenuItems;

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.backgroundProfile,
      paddingTop: Platform.OS === 'android' ? 25 : 0,
    },
    container: {
      flex: 1,
    },
    header: {
      alignItems: 'center',
      paddingVertical: 24,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 16,
    },
    name: {
      fontSize: 20,
      fontFamily: Fonts.semiBold,
      color: colors.textPrimary,
      marginBottom: 4,
    },
    email: {
      fontSize: 14,
      color: colors.textSecondary,
      fontFamily: Fonts.regular,
      marginBottom: 8,
    },
    businessBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primaryLight,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      gap: 6,
    },
    businessName: {
      fontSize: 12,
      fontFamily: Fonts.medium,
      color: colors.primary,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 16,
      marginHorizontal: 16,
      marginTop: 16,
      backgroundColor: colors.background,
      borderRadius: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    statCard: {
      alignItems: 'center',
      padding: 12,
    },
    statNumber: {
      fontSize: 24,
      fontFamily: Fonts.bold,
      color: colors.textPrimary,
    },
    ratingStatContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingStar: {
      marginLeft: 4,
    },
    statLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
      fontFamily: Fonts.regular,
    },
    menuContainer: {
      marginTop: 24,
      marginHorizontal: 16,
      backgroundColor: colors.background,
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    menuItem: {
      flexDirection: 'row',
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
    logoutButton: {
      marginHorizontal: 16,
      marginTop: 32,
      marginBottom: 40,
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={{ uri: currentUser.avatar }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{currentUser.name}</Text>
          <Text style={styles.email}>{currentUser.email}</Text>
          {isBusinessUser && establishment && (
            <View style={styles.businessBadge}>
              <Store size={16} color={colors.primary} />
              <Text style={styles.businessName}>{establishment.name}</Text>
            </View>
          )}
        </View>

        <View style={styles.statsContainer}>
          {isBusinessUser && establishment ? (
            <>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{establishment.numRatings}</Text>
                <Text style={styles.statLabel}>Avaliações</Text>
              </View>
              <View style={styles.statCard}>
                <View style={styles.ratingStatContainer}>
                  <Text style={styles.statNumber}>{establishment.averageRating.toFixed(1)}</Text>
                  <Star size={16} color={colors.primary} fill={colors.primary} style={styles.ratingStar} />
                </View>
                <Text style={styles.statLabel}>Média</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{userRatings.length}</Text>
                <Text style={styles.statLabel}>Avaliações</Text>
              </View>
              <View style={styles.statCard}>
                <View style={styles.ratingStatContainer}>
                  <Text style={styles.statNumber}>4.5</Text>
                  <Star size={16} color={colors.primary} fill={colors.primary} style={styles.ratingStar} />
                </View>
                <Text style={styles.statLabel}>Média</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.lastMenuItem
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
            </TouchableOpacity>
          ))}
        </View>

        <Button
          title="Sair"
          onPress={handleLogout}
          outline
          style={styles.logoutButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}