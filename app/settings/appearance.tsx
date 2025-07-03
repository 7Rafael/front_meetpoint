import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { Check, Sun, Moon, Smartphone } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors, Fonts, getColors } from '@/constants/Colors';

export default function AppearanceScreen() {
  const { theme, isDark, setTheme } = useTheme();
  const colors = getColors(isDark);

  const themeOptions = [
    {
      key: 'light' as const,
      title: 'Claro',
      subtitle: 'Sempre usar tema claro',
      icon: <Sun size={24} color={colors.textSecondary} />,
    },
    {
      key: 'dark' as const,
      title: 'Escuro',
      subtitle: 'Sempre usar tema escuro',
      icon: <Moon size={24} color={colors.textSecondary} />,
    },
    {
      key: 'system' as const,
      title: 'Sistema',
      subtitle: 'Seguir configuração do sistema',
      icon: <Smartphone size={24} color={colors.textSecondary} />,
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
      color: colors.textSecondary,
      lineHeight: 24,
      marginBottom: 24,
      fontFamily: Fonts.regular,
    },
    themeContainer: {
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
    themeItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lastThemeItem: {
      borderBottomWidth: 0,
    },
    themeIconContainer: {
      width: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    themeTextContainer: {
      flex: 1,
    },
    themeTitle: {
      fontSize: 16,
      fontFamily: Fonts.medium,
      color: colors.textPrimary,
      marginBottom: 2,
    },
    themeSubtitle: {
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 16,
      fontFamily: Fonts.regular,
    },
    checkContainer: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme === 'light' || theme === 'dark' || theme === 'system' ? colors.primary : 'transparent',
    },
    selectedCheck: {
      backgroundColor: colors.primary,
    },
    previewContainer: {
      backgroundColor: colors.background.primary,
      borderRadius: 16,
      padding: 20,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    previewTitle: {
      fontSize: 16,
      fontFamily: Fonts.semiBold,
      color: colors.textPrimary,
      marginBottom: 12,
    },
    previewCard: {
      backgroundColor: colors.background.secondary,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    previewCardTitle: {
      fontSize: 14,
      fontFamily: Fonts.medium,
      color: colors.textPrimary,
      marginBottom: 4,
    },
    previewCardText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: Fonts.regular,
    },
    previewButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 16,
      alignItems: 'center',
    },
    previewButtonText: {
      fontSize: 14,
      fontFamily: Fonts.medium,
      color: colors.white,
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.description}>
            Escolha como você prefere que o aplicativo seja exibido.
          </Text>

          <View style={styles.themeContainer}>
            {themeOptions.map((option, index) => (
              <TouchableOpacity 
                key={option.key} 
                style={[
                  styles.themeItem,
                  index === themeOptions.length - 1 && styles.lastThemeItem
                ]}
                onPress={() => setTheme(option.key)}
                activeOpacity={0.7}
              >
                <View style={styles.themeIconContainer}>
                  {option.icon}
                </View>
                <View style={styles.themeTextContainer}>
                  <Text style={styles.themeTitle}>{option.title}</Text>
                  <Text style={styles.themeSubtitle}>{option.subtitle}</Text>
                </View>
                <View style={[
                  styles.checkContainer,
                  theme === option.key && styles.selectedCheck
                ]}>
                  {theme === option.key && (
                    <Check size={16} color={colors.white} strokeWidth={3} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Prévia do tema</Text>
            <View style={styles.previewCard}>
              <Text style={styles.previewCardTitle}>Exemplo de card</Text>
              <Text style={styles.previewCardText}>
                Este é um exemplo de como o conteúdo aparecerá com o tema selecionado.
              </Text>
            </View>
            <TouchableOpacity style={styles.previewButton}>
              <Text style={styles.previewButtonText}>Botão de exemplo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}