import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  SectionList,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchAllCases } from '../../redux/slices/gameSlice';
import { Button, Card, LoadingOverlay, EmptyState } from '../../components';
import { COLORS, TYPOGRAPHY, SPACING } from '../../config/colors';
import { Case } from '../../types';

interface CaseSection {
  title: string;
  data: Case[];
}

const HomeScreen: React.FC<any> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { cases, isLoading, error } = useAppSelector((state) => state.game);
  const { userProfile } = useAppSelector((state) => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      await dispatch(fetchAllCases()).unwrap();
    } catch (error: any) {
      console.error('[HomeScreen] Error loading cases:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCases();
    setRefreshing(false);
  };

  // Group cases by difficulty
  const groupedCases: CaseSection[] = [
    {
      title: 'Featured Cases',
      data: cases.filter((c: Case) => c.is_featured),
    },
    {
      title: 'Easy',
      data: cases.filter((c: Case) => c.difficulty === 'easy' && !c.is_featured),
    },
    {
      title: 'Medium',
      data: cases.filter((c: Case) => c.difficulty === 'medium' && !c.is_featured),
    },
    {
      title: 'Hard',
      data: cases.filter((c: Case) => c.difficulty === 'hard' && !c.is_featured),
    },
    {
      title: 'Expert',
      data: cases.filter((c: Case) => c.difficulty === 'expert' && !c.is_featured),
    },
  ].filter((section: CaseSection) => section.data.length > 0);

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy':
        return COLORS.SUCCESS;
      case 'medium':
        return COLORS.SECONDARY;
      case 'hard':
        return COLORS.WARNING;
      case 'expert':
        return COLORS.ACCENT;
      default:
        return COLORS.TEXT_SECONDARY;
    }
  };

  const renderCaseItem = ({ item }: { item: Case }) => (
    <TouchableOpacity
      onPress={() => {
        // Navigate to case detail
        console.log('Case selected:', item.id);
      }}
      activeOpacity={0.7}
    >
      <Card style={styles.caseCard} variant="elevated">
        <View style={styles.caseImageContainer}>
          <View style={[styles.caseImagePlaceholder, { backgroundColor: getDifficultyColor(item.difficulty) + '20' }]}>
            <Text style={styles.caseEmoji}>🕵️</Text>
          </View>
          <View style={styles.caseMetadata}>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(item.difficulty) },
              ]}
            >
              <Text style={styles.difficultyText}>
                {item.difficulty.toUpperCase()}
              </Text>
            </View>
            <View style={styles.playTimeBadge}>
              <Text style={styles.playTimeText}>
                ⏱️ {item.estimated_play_time}m
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.caseContent}>
          <Text style={styles.caseTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.caseDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.caseStats}>
            <View style={styles.stat}>
              <Text style={styles.statIcon}>📖</Text>
              <Text style={styles.statText}>{item.total_chapters}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statIcon}>👁️</Text>
              <Text style={styles.statText}>{item.completion_count}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statIcon}>⭐</Text>
              <Text style={styles.statText}>
                {item.rating_count > 0
                  ? (item.rating_sum / item.rating_count).toFixed(1)
                  : 'N/A'}
              </Text>
            </View>
          </View>

          <Button
            title="Start Investigation"
            onPress={() => {}}
            variant="primary"
            size="small"
            fullWidth
            style={styles.startButton}
          />
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }: { section: CaseSection }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  if (isLoading && cases.length === 0) {
    return (
      <View style={styles.container}>
        <LoadingOverlay visible={true} message="Loading cases..." />
      </View>
    );
  }

  if (!isLoading && cases.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          icon="🔍"
          title="No Cases Found"
          description="We couldn't find any cases to investigate. Please try again later."
          actionText="Refresh"
          onAction={onRefresh}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome, Detective!</Text>
          <Text style={styles.subGreeting}>
            Level {userProfile?.level || 1} • {userProfile?.total_xp || 0} XP
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            // Navigate to profile
          }}
        >
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <Button
            title="Retry"
            onPress={onRefresh}
            variant="primary"
            size="small"
          />
        </View>
      )}

      <SectionList
        sections={groupedCases}
        keyExtractor={(item) => item.id}
        renderItem={renderCaseItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="🔍"
            title="No Cases"
            description="No cases match your criteria"
          />
        }
      />

      <LoadingOverlay visible={isLoading && cases.length > 0} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.PRIMARY_LIGHT,
  },
  greeting: {
    ...TYPOGRAPHY.H3,
    color: COLORS.PRIMARY,
    marginBottom: SPACING.xs,
  },
  subGreeting: {
    ...TYPOGRAPHY.CAPTION,
    color: COLORS.TEXT_SECONDARY,
  },
  profileIcon: {
    fontSize: 32,
  },
  errorContainer: {
    backgroundColor: COLORS.ERROR_LIGHT,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
    padding: SPACING.lg,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    ...TYPOGRAPHY.BODY_SMALL,
    color: COLORS.ERROR,
    flex: 1,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    gap: SPACING.lg,
  },
  sectionHeader: {
    ...TYPOGRAPHY.H4,
    color: COLORS.PRIMARY,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  caseCard: {
    overflow: 'hidden',
  },
  caseImageContainer: {
    position: 'relative',
    marginBottom: SPACING.lg,
  },
  caseImagePlaceholder: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caseEmoji: {
    fontSize: 48,
  },
  caseMetadata: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    position: 'absolute',
    bottom: SPACING.md,
    left: SPACING.lg,
  },
  difficultyBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  difficultyText: {
    ...TYPOGRAPHY.OVERLINE,
    color: COLORS.SURFACE,
    fontSize: 10,
  },
  playTimeBadge: {
    backgroundColor: COLORS.SURFACE,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  playTimeText: {
    ...TYPOGRAPHY.CAPTION,
    color: COLORS.TEXT_PRIMARY,
  },
  caseContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    gap: SPACING.md,
  },
  caseTitle: {
    ...TYPOGRAPHY.H4,
    color: COLORS.TEXT_PRIMARY,
  },
  caseDescription: {
    ...TYPOGRAPHY.BODY_SMALL,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 18,
  },
  caseStats: {
    flexDirection: 'row',
    gap: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.DIVIDER,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.DIVIDER,
  },
  stat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statIcon: {
    fontSize: 16,
  },
  statText: {
    ...TYPOGRAPHY.CAPTION,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  startButton: {
    marginTop: SPACING.sm,
  },
});

export default HomeScreen;