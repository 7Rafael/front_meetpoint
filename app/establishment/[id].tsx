import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MapPin, Clock } from 'lucide-react-native';
import Button from '@/components/Button';
import RatingStars from '@/components/RatingStars';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { getColors, Fonts } from '@/constants/Colors';
import ApiService from '@/service/api';

export default function EstablishmentScreen() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const colors = getColors(isDark);
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const [establishment, setEstablishment] = useState<any>(null);
  const [ratings, setRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadEstablishmentData();
    }
  }, [id]);

  const loadEstablishmentData = async () => {
    try {
      setLoading(true);
      const [establishmentData, ratingsData] = await Promise.all([
        ApiService.getEstabelecimentoById(id!),
        ApiService.getEstabelecimentoAvaliacoes(id!)
      ]);
      
      setEstablishment(establishmentData);
      setRatings(ratingsData);
    } catch (error) {
      console.error('Error loading establishment data:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do estabelecimento');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Avaliação incompleta', 'Por favor, selecione uma classificação de 1 a 5 estrelas.');
      return;
    }

    if (!user) {
      Alert.alert('Login necessário', 'Você precisa estar logado para avaliar um estabelecimento.');
      return;
    }

    setSubmitting(true);

    try {
      await ApiService.createAvaliacao({
        estabelecimento_id: parseInt(id!),
        nota: rating,
        comentario: comment.trim() || undefined
      });

      Alert.alert(
        'Avaliação enviada',
        'Obrigado por compartilhar sua opinião!',
        [
          {
            text: 'OK',
            onPress: () => {
              setRating(0);
              setComment('');
              loadEstablishmentData(); // Reload to show new rating
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível enviar a avaliação');
    } finally {
      setSubmitting(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.secondary,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    notFoundContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    notFoundText: {
      fontSize: 18,
      fontFamily: Fonts.semiBold,
      color: colors.text.secondary,
    },
    image: {
      width: '100%',
      height: 200,
    },
    contentContainer: {
      padding: 16,
    },
    headerContainer: {
      marginBottom: 16,
    },
    name: {
      fontSize: 24,
      fontFamily: Fonts.bold,
      color: colors.text.primary,
      marginBottom: 8,
    },
    categoryContainer: {
      backgroundColor: colors.primaryLight,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    category: {
      fontSize: 12,
      color: colors.primary,
      fontFamily: Fonts.medium,
    },
    infoContainer: {
      marginBottom: 20,
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    infoText: {
      fontSize: 14,
      color: colors.text.secondary,
      marginLeft: 8,
      fontFamily: Fonts.regular,
    },
    ratingOverviewContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background.primary,
      borderRadius: 16,
      padding: 16,
      marginBottom: 24,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    ratingNumberContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginRight: 16,
    },
    ratingNumber: {
      fontSize: 32,
      fontFamily: Fonts.bold,
      color: colors.text.primary,
    },
    ratingTotal: {
      fontSize: 16,
      color: colors.text.secondary,
      marginLeft: 2,
      fontFamily: Fonts.regular,
    },
    ratingStarsContainer: {
      flex: 1,
    },
    numRatings: {
      fontSize: 12,
      color: colors.text.secondary,
      marginTop: 4,
      fontFamily: Fonts.regular,
    },
    ratingFormContainer: {
      backgroundColor: colors.background.primary,
      borderRadius: 16,
      padding: 16,
      marginBottom: 24,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: Fonts.semiBold,
      color: colors.text.primary,
      marginBottom: 16,
    },
    ratingLabel: {
      fontSize: 14,
      fontFamily: Fonts.medium,
      color: colors.text.secondary,
      marginBottom: 8,
    },
    ratingStars: {
      marginBottom: 16,
    },
    commentLabel: {
      fontSize: 14,
      fontFamily: Fonts.medium,
      color: colors.text.secondary,
      marginBottom: 8,
    },
    commentInput: {
      backgroundColor: colors.background.accent,
      borderRadius: 12,
      padding: 12,
      fontSize: 14,
      color: colors.text.primary,
      height: 100,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
      fontFamily: Fonts.regular,
    },
    submitButton: {
      width: '100%',
    },
    reviewsContainer: {
      backgroundColor: colors.background.primary,
      borderRadius: 16,
      padding: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    reviewCard: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingVertical: 12,
    },
    reviewHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    reviewUser: {
      fontSize: 14,
      fontFamily: Fonts.semiBold,
      color: colors.text.primary,
    },
    reviewDate: {
      fontSize: 12,
      color: colors.text.secondary,
      fontFamily: Fonts.regular,
    },
    reviewRating: {
      marginBottom: 8,
    },
    reviewComment: {
      fontSize: 14,
      color: colors.text.secondary,
      lineHeight: 20,
      fontFamily: Fonts.regular,
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!establishment) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Estabelecimento não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ 
          uri: establishment.imagem_url || 'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=800'
        }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.name}>{establishment.nome}</Text>
          <View style={styles.categoryContainer}>
            <Text style={styles.category}>{establishment.categoria}</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <MapPin size={16} color={colors.text.secondary} />
            <Text style={styles.infoText}>{establishment.endereco}</Text>
          </View>
          <View style={styles.infoItem}>
            <Clock size={16} color={colors.text.secondary} />
            <Text style={styles.infoText}>
              {establishment.horario_funcionamento || 'Horário não informado'}
            </Text>
          </View>
        </View>

        <View style={styles.ratingOverviewContainer}>
          <View style={styles.ratingNumberContainer}>
            <Text style={styles.ratingNumber}>
              {Number(establishment.media_avaliacoes || 0).toFixed(1)}
            </Text>
            <Text style={styles.ratingTotal}>/ 5</Text>
          </View>
          <View style={styles.ratingStarsContainer}>
            <RatingStars rating={establishment.media_avaliacoes || 0} size={20} />
            <Text style={styles.numRatings}>
              {establishment.total_avaliacoes} {establishment.total_avaliacoes === 1 ? 'avaliação' : 'avaliações'}
            </Text>
          </View>
        </View>

        {user?.type === 'cliente' && (
          <View style={styles.ratingFormContainer}>
            <Text style={styles.sectionTitle}>Avaliar Estabelecimento</Text>
            <Text style={styles.ratingLabel}>Sua classificação</Text>
            <RatingStars
              rating={rating}
              size={32}
              interactive={true}
              onRatingChange={handleRatingChange}
              style={styles.ratingStars}
            />
            <Text style={styles.commentLabel}>Seu comentário (opcional)</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Compartilhe sua experiência..."
              placeholderTextColor={colors.text.secondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={comment}
              onChangeText={setComment}
            />
            <Button
              title="Enviar Avaliação"
              onPress={handleSubmit}
              loading={submitting}
              disabled={rating === 0}
              style={styles.submitButton}
            />
          </View>
        )}

        {ratings.length > 0 && (
          <View style={styles.reviewsContainer}>
            <Text style={styles.sectionTitle}>Avaliações Recentes</Text>
            {ratings.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewUser}>
                    {review.cliente_nome || 'Usuário'}
                  </Text>
                  <Text style={styles.reviewDate}>
                    {new Date(review.created_at).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
                <RatingStars rating={review.nota} size={16} style={styles.reviewRating} />
                <Text style={styles.reviewComment}>{review.comentario}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}