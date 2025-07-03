import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Image
} from 'react-native';
import { Search, Filter, TrendingUp, Users, Star, MessageSquare } from 'lucide-react-native';
import EstablishmentCard from '@/components/EstablishmentCard';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors, Fonts } from '@/constants/Colors';
import { establishments, getCurrentUser, getBusinessEstablishment, getEstablishmentRatings } from '@/utils/mockData';

export default function HomeScreen() {
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const currentUser = getCurrentUser();
  const isBusinessUser = currentUser.type === 'business';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');

  const filters = ['Todos', 'Restaurante', 'Café', 'Bar', 'Padaria', 'Mercado'];

  const filteredEstablishments = establishments.filter(establishment => {
    const matchesSearch = establishment.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'Todos' || establishment.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

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
    businessContent: {
      padding: 16,
    },
    businessHeader: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    businessImage: {
      width: '100%',
      height: 120,
      borderRadius: 12,
      marginBottom: 16,
    },
    businessInfo: {
      alignItems: 'center',
    },
    businessName: {
      fontSize: 24,
      fontFamily: Fonts.bold,
      color: colors.textPrimary,
      marginBottom: 4,
    },
    businessCategory: {
      fontSize: 16,
      fontFamily: Fonts.medium,
      color: colors.primary,
      marginBottom: 8,
    },
    businessAddress: {
      fontSize: 14,
      fontFamily: Fonts.regular,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    dashboardGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 24,
    },
    dashboardCard: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 16,
      width: '48%',
      alignItems: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    dashboardValue: {
      fontSize: 24,
      fontFamily: Fonts.bold,
      color: colors.textPrimary,
      marginTop: 8,
      marginBottom: 4,
    },
    dashboardLabel: {
      fontSize: 12,
      fontFamily: Fonts.regular,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    recentSection: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 20,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: Fonts.semiBold,
      color: colors.textPrimary,
      marginBottom: 16,
    },
    recentRatingCard: {
      backgroundColor: colors.backgroundProfile,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    recentRatingHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    ratingStars: {
      flexDirection: 'row',
      gap: 2,
    },
    recentRatingDate: {
      fontSize: 12,
      fontFamily: Fonts.regular,
      color: colors.textSecondary,
    },
    recentRatingComment: {
      fontSize: 14,
      fontFamily: Fonts.regular,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    header: {
      backgroundColor: colors.backgroundProfile,
      paddingTop: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      marginHorizontal: 16,
      marginBottom: 12,
      borderRadius: 12,
      paddingHorizontal: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      height: 48,
      fontSize: 16,
      color: colors.textPrimary,
      fontFamily: Fonts.regular,
    },
    filtersContainer: {
      paddingHorizontal: 16,
      paddingBottom: 12,
    },
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.background,
      marginRight: 8,
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

  if (isBusinessUser) {
    const establishment = currentUser.businessId ? getBusinessEstablishment(currentUser.businessId) : null;
    const ratings = establishment ? getEstablishmentRatings(establishment.id) : [];

    if (!establishment) {
      return (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Estabelecimento não encontrado</Text>
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.businessContent}>
            <View style={styles.businessHeader}>
              <Image
                source={{ uri: establishment.imageUrl }}
                style={styles.businessImage}
                resizeMode="cover"
              />
              <View style={styles.businessInfo}>
                <Text style={styles.businessName}>{establishment.name}</Text>
                <Text style={styles.businessCategory}>{establishment.category}</Text>
                <Text style={styles.businessAddress}>{establishment.address}</Text>
              </View>
            </View>

            <View style={styles.dashboardGrid}>
              <View style={styles.dashboardCard}>
                <Star size={24} color={colors.primary} />
                <Text style={styles.dashboardValue}>{establishment.averageRating.toFixed(1)}</Text>
                <Text style={styles.dashboardLabel}>Avaliação Média</Text>
              </View>
              
              <View style={styles.dashboardCard}>
                <MessageSquare size={24} color={colors.success} />
                <Text style={styles.dashboardValue}>{establishment.numRatings}</Text>
                <Text style={styles.dashboardLabel}>Avaliações</Text>
              </View>
              
              <View style={styles.dashboardCard}>
                <Users size={24} color={colors.primary} />
                <Text style={styles.dashboardValue}>1.2k</Text>
                <Text style={styles.dashboardLabel}>Visualizações</Text>
              </View>
              
              <View style={styles.dashboardCard}>
                <TrendingUp size={24} color={colors.success} />
                <Text style={styles.dashboardValue}>+8.5%</Text>
                <Text style={styles.dashboardLabel}>Crescimento</Text>
              </View>
            </View>

            <View style={styles.recentSection}>
              <Text style={styles.sectionTitle}>Avaliações Recentes</Text>
              {ratings.slice(0, 3).map((rating) => (
                <View key={rating.id} style={styles.recentRatingCard}>
                  <View style={styles.recentRatingHeader}>
                    <View style={styles.ratingStars}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          color={i < rating.rating ? colors.primary : colors.textSecondary}
                          fill={i < rating.rating ? colors.primary : 'transparent'}
                        />
                      ))}
                    </View>
                    <Text style={styles.recentRatingDate}>{rating.date}</Text>
                  </View>
                  <Text style={styles.recentRatingComment}>{rating.comment}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar estabelecimentos..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  activeFilter === filter && styles.activeFilterButton
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeFilter === filter && styles.activeFilterText
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {filteredEstablishments.length > 0 ? (
          <FlatList
            data={filteredEstablishments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <EstablishmentCard establishment={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Filter size={60} color={colors.textSecondary} />
            <Text style={styles.emptyText}>
              Nenhum estabelecimento encontrado para "{searchQuery}"
            </Text>
            <Text style={styles.emptySubtext}>
              Tente buscar com termos diferentes ou alterar o filtro
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}