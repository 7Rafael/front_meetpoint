import React, { useState, useEffect } from 'react';
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
  Image,
  ActivityIndicator
} from 'react-native';
import { Search, Filter, TrendingUp, Users, Star, MessageSquare } from 'lucide-react-native';
import EstablishmentCard from '@/components/EstablishmentCard';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { getColors, Fonts } from '@/constants/Colors';
import ApiService from '@/service/api';

export default function HomeScreen() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const colors = getColors(isDark);
  const isBusinessUser = user?.type === 'estabelecimento';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [establishments, setEstablishments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [businessStats, setBusinessStats] = useState(null);
  const [businessRatings, setBusinessRatings] = useState([]);

  const filters = ['Todos', 'Restaurante', 'Café', 'Bar', 'Padaria', 'Mercado'];

  useEffect(() => {
    if (isBusinessUser) {
      loadBusinessData();
    } else {
      loadEstablishments();
    }
  }, [isBusinessUser, user]);

  useEffect(() => {
    if (!isBusinessUser) {
      loadEstablishments();
    }
  }, [searchQuery, activeFilter]);

  const loadEstablishments = async () => {
    try {
      setLoading(true);
      const categoria = activeFilter === 'Todos' ? undefined : activeFilter;
      const busca = searchQuery.trim() || undefined;
      
      const data = await ApiService.getEstabelecimentos(categoria, busca);
      setEstablishments(data);
    } catch (error) {
      console.error('Error loading establishments:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBusinessData = async () => {
    try {
      setLoading(true);
      if (user?.id) {
        const [stats, ratings] = await Promise.all([
          ApiService.getEstabelecimentoEstatisticas(user.id.toString()),
          ApiService.getEstabelecimentoAvaliacoes(user.id.toString())
        ]);
        setBusinessStats(stats);
        setBusinessRatings(ratings.slice(0, 3)); // Only show 3 recent ratings
      }
    } catch (error) {
      console.error('Error loading business data:', error);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.backgroundProfile,
      paddingTop: Platform.OS === 'android' ? 25 : 0,
    },
    container: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (isBusinessUser) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.businessContent}>
            <View style={styles.businessHeader}>
              <View style={styles.businessInfo}>
                <Text style={styles.businessName}>{user?.nome}</Text>
                <Text style={styles.businessCategory}>{user?.categoria}</Text>
                <Text style={styles.businessAddress}>{user?.endereco}</Text>
              </View>
            </View>

            <View style={styles.dashboardGrid}>
              <View style={styles.dashboardCard}>
                <Star size={24} color={colors.primary} />
                <Text style={styles.dashboardValue}>
                  {businessStats?.media_avaliacoes ? Number(businessStats.media_avaliacoes).toFixed(1) : '0.0'}
                </Text>
                <Text style={styles.dashboardLabel}>Avaliação Média</Text>
              </View>
              
              <View style={styles.dashboardCard}>
                <MessageSquare size={24} color={colors.success} />
                <Text style={styles.dashboardValue}>{businessStats?.total_avaliacoes || 0}</Text>
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
              {businessRatings.length > 0 ? (
                businessRatings.map((rating: any) => (
                  <View key={rating.id} style={styles.recentRatingCard}>
                    <View style={styles.recentRatingHeader}>
                      <View style={styles.ratingStars}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            color={i < rating.nota ? colors.primary : colors.textSecondary}
                            fill={i < rating.nota ? colors.primary : 'transparent'}
                          />
                        ))}
                      </View>
                      <Text style={styles.recentRatingDate}>
                        {new Date(rating.created_at).toLocaleDateString('pt-BR')}
                      </Text>
                    </View>
                    <Text style={styles.recentRatingComment}>{rating.comentario}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptySubtext}>Nenhuma avaliação ainda</Text>
              )}
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

        {establishments.length > 0 ? (
          <FlatList
            data={establishments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <EstablishmentCard establishment={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Filter size={60} color={colors.textSecondary} />
            <Text style={styles.emptyText}>
              Nenhum estabelecimento encontrado
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