import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { supabase } from '../../src/config/supabase';
import { COLORS } from '../../src/config/colors';

interface Case {
  id: string;
  title: string;
  description: string;
  long_description?: string;
  difficulty: string;
  thumbnail_url?: string;
  storyline?: string;
  total_episodes: number;
  total_chapters: number;
  estimated_play_time?: number;
  case_number: number;
}

interface Chapter {
  id: string;
  chapter_number: number;
  title: string;
  description?: string;
  reward_xp: number;
  is_locked: boolean;
  required_level: number;
}

export default function CaseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCaseDetails();
      fetchChapters();
    }
  }, [id]);

  const fetchCaseDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setCaseData(data);
    } catch (error) {
      console.error('Error fetching case details:', error);
    }
  };

  const fetchChapters = async () => {
    try {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('case_id', id)
        .order('chapter_number');

      if (error) throw error;
      setChapters(data || []);
    } catch (error) {
      console.error('Error fetching chapters:', error);
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

  const handleChapterPress = (chapter: Chapter) => {
    if (!chapter.is_locked) {
      // TODO: Navigate to chapter screen
      console.log('Starting chapter:', chapter.title);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading case details...</Text>
      </View>
    );
  }

  if (!caseData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Case not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {caseData.thumbnail_url && (
        <Image source={{ uri: caseData.thumbnail_url }} style={styles.thumbnail} />
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{caseData.title}</Text>
          <View style={styles.metadata}>
            <Text style={[styles.difficulty, { color: getDifficultyColor(caseData.difficulty) }]}>
              {caseData.difficulty.toUpperCase()}
            </Text>
            <Text style={styles.caseNumber}>Case #{caseData.case_number}</Text>
          </View>
        </View>

        <Text style={styles.description}>{caseData.description}</Text>
        
        {caseData.long_description && (
          <Text style={styles.longDescription}>{caseData.long_description}</Text>
        )}

        {caseData.storyline && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Storyline</Text>
            <Text style={styles.storyline}>{caseData.storyline}</Text>
          </View>
        )}

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{caseData.total_chapters}</Text>
            <Text style={styles.statLabel}>Chapters</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{caseData.total_episodes}</Text>
            <Text style={styles.statLabel}>Episodes</Text>
          </View>
          {caseData.estimated_play_time && (
            <View style={styles.stat}>
              <Text style={styles.statValue}>{caseData.estimated_play_time}m</Text>
              <Text style={styles.statLabel}>Est. Time</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chapters</Text>
          {chapters.map((chapter) => (
            <TouchableOpacity
              key={chapter.id}
              style={[
                styles.chapterCard,
                chapter.is_locked && styles.lockedChapter
              ]}
              onPress={() => handleChapterPress(chapter)}
              disabled={chapter.is_locked}
            >
              <View style={styles.chapterInfo}>
                <Text style={styles.chapterTitle}>{chapter.title}</Text>
                <Text style={styles.chapterDescription}>{chapter.description}</Text>
                <View style={styles.chapterFooter}>
                  <Text style={styles.chapterReward}>+{chapter.reward_xp} XP</Text>
                  <Text style={styles.chapterLevel}>Level {chapter.required_level}</Text>
                </View>
              </View>
              <Text style={styles.chapterNumber}>Ch {chapter.chapter_number}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.DANGER,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  thumbnail: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.BACKGROUND_DARK,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficulty: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  caseNumber: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  description: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 24,
    marginBottom: 15,
  },
  longDescription: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 22,
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 10,
  },
  storyline: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    padding: 15,
    borderRadius: 8,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  chapterCard: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  lockedChapter: {
    opacity: 0.6,
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  chapterDescription: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
  },
  chapterFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chapterReward: {
    fontSize: 12,
    color: COLORS.SUCCESS,
    fontWeight: 'bold',
  },
  chapterLevel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  chapterNumber: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
    marginLeft: 15,
  },
});
