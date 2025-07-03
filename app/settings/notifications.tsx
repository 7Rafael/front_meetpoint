import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, SafeAreaView, Platform } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors, Fonts } from '@/constants/Colors';

export default function NotificationsScreen() {
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const [notifications, setNotifications] = useState({
    pushNotifications: true,
    emailNotifications: true,
    newRatings: true,
    responses: true,
    promotions: false,
    weeklyDigest: true,
  });

  const handleToggle = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const notificationItems = [
    {
      key: 'pushNotifications',
      title: 'Notificações push',
      subtitle: 'Receber notificações no dispositivo',
      value: notifications.pushNotifications,
    },
    {
      key: 'emailNotifications',
      title: 'Notificações por email',
      subtitle: 'Receber emails sobre atividades',
      value: notifications.emailNotifications,
    },
    {
      key: 'newRatings',
      title: 'Novas avaliações',
      subtitle: 'Quando alguém avaliar um estabelecimento que você segue',
      value: notifications.newRatings,
    },
    {
      key: 'responses',
      title: 'Respostas às avaliações',
      subtitle: 'Quando estabelecimentos responderem suas avaliações',
      value: notifications.responses,
    },
    {
      key: 'promotions',
      title: 'Promoções e ofertas',
      subtitle: 'Receber ofertas especiais de estabelecimentos',
      value: notifications.promotions,
    },
    {
      key: 'weeklyDigest',
      title: 'Resumo semanal',
      subtitle: 'Resumo das atividades da semana',
      value: notifications.weeklyDigest,
    },
  ];

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
      padding: 24,
    },
    description: {
      fontSize: 16,
      color: colors.text.secondary,
      lineHeight: 24,
      marginBottom: 24,
      fontFamily: Fonts.regular,
    },
    notificationsContainer: {
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
    notificationItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lastNotificationItem: {
      borderBottomWidth: 0,
    },
    notificationTextContainer: {
      flex: 1,
      marginRight: 16,
    },
    notificationTitle: {
      fontSize: 16,
      fontFamily: Fonts.medium,
      color: colors.text.primary,
      marginBottom: 2,
    },
    notificationSubtitle: {
      fontSize: 12,
      color: colors.text.secondary,
      lineHeight: 16,
      fontFamily: Fonts.regular,
    },
    infoContainer: {
      backgroundColor: colors.background.primary,
      borderRadius: 16,
      padding: 20,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    infoTitle: {
      fontSize: 16,
      fontFamily: Fonts.semiBold,
      color: colors.text.primary,
      marginBottom: 8,
    },
    infoText: {
      fontSize: 14,
      color: colors.text.secondary,
      lineHeight: 20,
      fontFamily: Fonts.regular,
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.description}>
            Configure como e quando você deseja receber notificações do MeetPoint.
          </Text>

          <View style={styles.notificationsContainer}>
            {notificationItems.map((item, index) => (
              <View 
                key={item.key} 
                style={[
                  styles.notificationItem,
                  index === notificationItems.length - 1 && styles.lastNotificationItem
                ]}
              >
                <View style={styles.notificationTextContainer}>
                  <Text style={styles.notificationTitle}>{item.title}</Text>
                  <Text style={styles.notificationSubtitle}>{item.subtitle}</Text>
                </View>
                <Switch
                  value={item.value}
                  onValueChange={() => handleToggle(item.key)}
                  trackColor={{ 
                    false: colors.textSecondary, 
                    true: colors.primaryLight 
                  }}
                  thumbColor={item.value ? colors.primary : colors.background.primary}
                />
              </View>
            ))}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Sobre as notificações</Text>
            <Text style={styles.infoText}>
              Você pode alterar essas configurações a qualquer momento. 
              As notificações push podem ser desabilitadas nas configurações do seu dispositivo.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}