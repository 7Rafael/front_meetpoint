import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import { Star, Filter, TrendingUp, TrendingDown } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors, Fonts } from '@/constants/Colors';
import { getCurrentUser, getBusinessEstablishment, getEstablishmentRatings } from '@/utils/mockData';

export default function ReviewsScreen() {
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const currentUser = getCurrentUser();
  const establishment = currentUser.type === 'business' && currentUser.businessId 
    ? getBusinessEstablishment(currentUser.businessId) 
    : null;
  
  const allRatings = establishment ? getEstablishmentRatings(establishment.id) : [];
  const [selectedFilter, setSelectedFilter] = useState('all');

  if (!establishment) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Estabelecimento não encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  const filteredRatings = allRatings.filter(rating => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'high') return rating.rating >= 4;
    if (selectedFilter === 'low') return rating.rating <= 2;
    return true;
  });

  const filters = [
    { key: 'all', label: 'Todas', count: allRatings.length },
    { key: 'high', label: 'Positivas', count: allRatings.filter(r => r.rating >= 4).length },
    { key: 'low', label: 'Negativas', count: allRatings.filter(r => r.rating <= 2).length },
  ];

  const renderRatingItem = ({ item }: { item: any }) => (
    <View style={styles.ratingCard}>
      <View style={styles.ratingHeader}>
        <View style={styles.ratingStars}>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={18}
              color={i < item.rating ? colors.primary : colors.textSecondary}
              fill={i < item.rating ? colors.primary : 'transparent'}
            />
          ))}
        </View>
        <Text style={styles.ratingDate}>{item.date}</Text>
      </View>
      <Text style={styles.ratingComment}>{item.comment}</Text>
      <View style={styles.ratingFooter}>
        <Text style={styles.ratingUser}>Cliente anônimo</Text>
        {item.rating >= 4 ? (
          <View style={styles.positiveIndicator}>
            <TrendingUp size={16} color={colors.success} />
            <Text style={styles.positiveText}>Positiva</Text>
          </View>
        ) : item.rating <= 2 ? (
          <View style={styles.negativeIndicator}>
            <TrendingDown size={16} color={colors.error} />
            <Text style={styles.negativeText}>Negativa</Text>
          </View>
        ) : null}
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.backgroundProfile,
      paddingTop: Platform.OS === 'android' ? 25 : 0,
    },
    container: {
      flex: 1,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    errorText: {
      fontSize: 18,
      fontFamily: Fonts.semiBold,
      color: colors.textSecondary,
    },
    header: {
      backgroundColor: colors.backgroundProfile,
      paddingTop: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    summaryCard: {
      backgroundColor: colors.background,
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 16,
      padding: 20,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    summaryTitle: {
      fontSize: 18,
      fontFamily: Fonts.semiBold,
      color: colors.textPrimary,
      marginBottom: 16,
    },
    summaryContent: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    summaryItem: {
      alignItems: 'center',
    },
    summaryValue: {
      fontSize: 24,
      fontFamily: Fonts.bold,
      color: colors.primary,
      marginBottom: 4,
    },
    summaryLabel: {
      fontSize: 14,
      fontFamily: Fonts.regular,
      color: colors.textSecondary,
    },
    filtersContainer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingBottom: 16,
      gap: 8,
    },
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    activeFilterButton: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontFamily: Fonts.medium,
    },
    activeFilterText: {
      color: colors.white,
    },
    listContainer: {
      padding: 16,
    },
    ratingCard: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    ratingHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    ratingStars: {
      flexDirection: 'row',
      gap: 2,
    },
    ratingDate: {
      fontSize: 12,
      fontFamily: Fonts.regular,
      color: colors.textSecondary,
    },
    ratingComment: {
      fontSize: 14,
      fontFamily: Fonts.regular,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 12,
    },
    ratingFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    ratingUser: {
      fontSize: 12,
      fontFamily: Fonts.medium,
      color: colors.textPrimary,
    },
    positiveIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    positiveText: {
      fontSize: 12,
      fontFamily: Fonts.medium,
      color: colors.success,
    },
    negativeIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    negativeText: {
      fontSize: 12,
      fontFamily: Fonts.medium,
      color: colors.error,
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
        <View style={styles.header}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumo das Avaliações</Text>
            <View style={styles.summaryContent}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{establishment.averageRating.toFixed(1)}</Text>
                <Text style={styles.summaryLabel}>Média Geral</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{establishment.numRatings}</Text>
                <Text style={styles.summaryLabel}>Total</Text>
              </View>
            </View>
          </View>

          <View style={styles.filtersContainer}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterButton,
                  selectedFilter === filter.key && styles.activeFilterButton
                ]}
                onPress={() => setSelectedFilter(filter.key)}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === filter.key && styles.activeFilterText
                  ]}
                >
                  {filter.label} ({filter.count})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {filteredRatings.length > 0 ? (
          <FlatList
            data={filteredRatings}
            keyExtractor={(item) => item.id}
            renderItem={renderRatingItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Filter size={60} color={colors.textSecondary} />
            <Text style={styles.emptyText}>
              Nenhuma avaliação encontrada
            </Text>
            <Text style={styles.emptySubtext}>
              {selectedFilter === 'all' 
                ? 'Seu estabelecimento ainda não recebeu avaliações'
                : 'Nenhuma avaliação corresponde ao filtro selecionado'
              }
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}