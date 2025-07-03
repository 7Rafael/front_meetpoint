import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import RatingStars from './RatingStars';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors, Fonts } from '@/constants/Colors';

interface EstablishmentCardProps {
  establishment: {
    id: number;
    nome: string;
    endereco: string;
    categoria: string;
    descricao?: string;
    imagem_url?: string;
    media_avaliacoes: number;
    total_avaliacoes: number;
  };
}

const EstablishmentCard = ({ establishment }: EstablishmentCardProps) => {
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const router = useRouter();

  const handlePress = () => {
    router.push(`/establishment/${establishment.id}`);
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.background,
      borderRadius: 16,
      marginBottom: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: 160,
    },
    contentContainer: {
      padding: 16,
    },
    name: {
      fontSize: 18,
      fontFamily: Fonts.semiBold,
      color: colors.textPrimary,
      marginBottom: 4,
    },
    categoryContainer: {
      backgroundColor: colors.primaryLight,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start',
      marginBottom: 8,
    },
    category: {
      fontSize: 12,
      color: colors.primary,
      fontFamily: Fonts.medium,
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    address: {
      fontSize: 14,
      color: colors.textSecondary,
      marginLeft: 4,
      fontFamily: Fonts.regular,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginLeft: 8,
      fontFamily: Fonts.regular,
    },
  });

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <Image
        source={{ 
          uri: establishment.imagem_url || 'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=800'
        }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.contentContainer}>
        <Text style={styles.name}>{establishment.nome}</Text>
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>{establishment.categoria}</Text>
        </View>
        <View style={styles.locationContainer}>
          <MapPin size={14} color={colors.textSecondary} />
          <Text style={styles.address}>{establishment.endereco}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <RatingStars rating={establishment.media_avaliacoes} size={16} />
          <Text style={styles.ratingText}>
            {Number(establishment.media_avaliacoes).toFixed(1)} ({establishment.total_avaliacoes})
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EstablishmentCard;