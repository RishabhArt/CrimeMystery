import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { supabase } from '../src/config/supabase';
import { COLORS } from '../src/config/colors';

interface Case {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  thumbnail_url?: string;
  case_number: number;
}

export default function CasesScreen() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('is_published', true)
        .order('case_number');

      if (error) throw error;
      setCases(data || []);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return COLORS.SUCCESS;
      case 'medium': return COLORS.WARNING;
      case 'hard': return COLORS.DANGER;
      default: return COLORS.TEXT_SECONDARY;
    }
  };

  const renderCase = ({ item }: { item: Case }) => (
    <TouchableOpacity
      style={styles.caseCard}
      onPress={() => router.push(`/case/${item.id}`)}
    >
      {item.thumbnail_url && (
        <Image source={{ uri: item.thumbnail_url }} style={styles.thumbnail} />
      )}
      <View style={styles.caseInfo}>
        <Text style={styles.caseTitle}>{item.title}</Text>
        <Text style={styles.caseDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.footer}>
          <Text style={[styles.difficulty, { color: getDifficultyColor(item.difficulty) }]}>
            {item.difficulty.toUpperCase()}
          </Text>
          <Text style={styles.caseNumber}>Case #{item.case_number}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading cases...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Cases</Text>
      <FlatList
        data={cases}
        renderItem={renderCase}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  caseCard: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  thumbnail: {
    width: '100%',
    height: 150,
    backgroundColor: COLORS.BACKGROUND_DARK,
  },
  caseInfo: {
    padding: 15,
  },
  caseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  caseDescription: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficulty: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  caseNumber: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
});
