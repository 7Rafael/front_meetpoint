import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Platform } from 'react-native';
import { Star } from 'lucide-react-native';
import UserRatingCard from '@/components/UserRatingCard';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors, Fonts } from '@/constants/Colors';
import { getCurrentUser, getUserRatings } from '@/utils/mockData';

export default function MyRatingsScreen() {
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const currentUser = getCurrentUser();
  const userRatings = getUserRatings(currentUser.id);

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.backgroundProfile,
      paddingTop: Platform.OS === 'android' ? 25 : 0,
    },
    container: {
      flex: 1,
    },
    listContainer: {
      padding: 16,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    emptyText: {
      fontSize: 18,
      fontFamily: Fonts.semiBold,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 16,
    },
    emptySubtext: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 8,
      fontFamily: Fonts.regular,
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {userRatings.length > 0 ? (
          <FlatList
            data={userRatings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <UserRatingCard rating={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Star size={60} color={colors.textSecondary} />
            <Text style={styles.emptyText}>
              Você ainda não avaliou nenhum estabelecimento
            </Text>
            <Text style={styles.emptySubtext}>
              Encontre estabelecimentos na aba Início e compartilhe sua opinião
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}