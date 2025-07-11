import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, Linking } from 'react-native';
import { ChevronRight, Mail, MessageCircle, Phone } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors, Fonts } from '@/constants/Colors';

export default function HelpScreen() {
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  const faqItems = [
    {
      question: 'Como avaliar um estabelecimento?',
      answer: 'Encontre o estabelecimento na lista, toque nele e selecione de 1 a 5 estrelas.',
    },
    {
      question: 'Posso editar minha avaliação?',
      answer: 'Sim, você pode editar suas avaliações a qualquer momento na aba "Minhas Avaliações".',
    },
    {
      question: 'Como cadastrar meu estabelecimento?',
      answer: 'Faça logout e escolha "Cadastrar como Estabelecimento" na tela inicial.',
    },
    {
      question: 'Minha avaliação não aparece',
      answer: 'Avaliações podem levar alguns minutos para aparecer. Verifique sua conexão.',
    },
    {
      question: 'Como alterar minha senha?',
      answer: 'Vá em Configurações > Conta > Alterar senha.',
    },
  ];

  const contactOptions = [
    {
      icon: <Mail size={24} color={colors.primary} />,
      title: 'Email',
      subtitle: 'suporte@meetpoint.com',
      onPress: () => Linking.openURL('mailto:suporte@meetpoint.com'),
    },
    {
      icon: <MessageCircle size={24} color={colors.primary} />,
      title: 'Chat ao vivo',
      subtitle: 'Disponível das 9h às 18h',
      onPress: () => {},
    },
    {
      icon: <Phone size={24} color={colors.primary} />,
      title: 'Telefone',
      subtitle: '(11) 3000-0000',
      onPress: () => Linking.openURL('tel:+551130000000'),
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
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: Fonts.semiBold,
      color: colors.text.primary,
      marginBottom: 12,
    },
    faqContainer: {
      backgroundColor: colors.background.primary,
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    faqItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lastFaqItem: {
      borderBottomWidth: 0,
    },
    question: {
      fontSize: 16,
      fontFamily: Fonts.medium,
      color: colors.text.primary,
      marginBottom: 8,
    },
    answer: {
      fontSize: 14,
      color: colors.text.secondary,
      lineHeight: 20,
      fontFamily: Fonts.regular,
    },
    contactDescription: {
      fontSize: 14,
      color: colors.text.secondary,
      marginBottom: 16,
      lineHeight: 20,
      fontFamily: Fonts.regular,
    },
    contactContainer: {
      backgroundColor: colors.background.primary,
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lastContactItem: {
      borderBottomWidth: 0,
    },
    contactIconContainer: {
      width: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    contactTextContainer: {
      flex: 1,
    },
    contactTitle: {
      fontSize: 16,
      fontFamily: Fonts.medium,
      color: colors.text.primary,
      marginBottom: 2,
    },
    contactSubtitle: {
      fontSize: 12,
      color: colors.text.secondary,
      fontFamily: Fonts.regular,
    },
    aboutContainer: {
      backgroundColor: colors.background.primary,
      borderRadius: 16,
      padding: 20,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    aboutText: {
      fontSize: 14,
      color: colors.text.secondary,
      lineHeight: 20,
      marginBottom: 16,
      fontFamily: Fonts.regular,
    },
    aboutVersion: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
      fontFamily: Fonts.regular,
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Perguntas frequentes</Text>
            <View style={styles.faqContainer}>
              {faqItems.map((item, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.faqItem,
                    index === faqItems.length - 1 && styles.lastFaqItem
                  ]}
                >
                  <Text style={styles.question}>{item.question}</Text>
                  <Text style={styles.answer}>{item.answer}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Entre em contato</Text>
            <Text style={styles.contactDescription}>
              Não encontrou a resposta que procurava? Nossa equipe está pronta para ajudar.
            </Text>
            <View style={styles.contactContainer}>
              {contactOptions.map((option, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[
                    styles.contactItem,
                    index === contactOptions.length - 1 && styles.lastContactItem
                  ]}
                  onPress={option.onPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.contactIconContainer}>
                    {option.icon}
                  </View>
                  <View style={styles.contactTextContainer}>
                    <Text style={styles.contactTitle}>{option.title}</Text>
                    <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
                  </View>
                  <ChevronRight size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre o MeetPoint</Text>
            <View style={styles.aboutContainer}>
              <Text style={styles.aboutText}>
                O MeetPoint é uma plataforma que conecta pessoas aos melhores estabelecimentos da sua região. 
                Nossa missão é ajudar você a descobrir novos lugares e compartilhar suas experiências.
              </Text>
              <Text style={styles.aboutVersion}>
                Versão 1.0.0 • Desenvolvido com ❤️
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}