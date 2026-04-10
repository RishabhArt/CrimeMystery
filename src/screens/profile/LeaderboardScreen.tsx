import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useAppSelector } from '../../redux/hooks';
import { Card, Button } from '../../components';
import { COLORS, TYPOGRAPHY, SPACING } from '../../config/colors';

type LeaderboardType = 'global' | 'weekly' | 'monthly';

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  cases: number;
  isCurrentUser?: boolean;
}

// Mock data - replace with real data from Redux
const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Detective Sherlock', score: 15000, cases: 45, isCurrentUser: false },
  { rank: 2, name: 'Mystery Solver Max', score: 14500, cases: 43, isCurrentUser: false },
  { rank: 3, name: 'Crime Fighter Sarah', score: 14000, cases: 42, isCurrentUser: false },
  { rank: 4, name: 'You', score: 13500, cases: 40, isCurrentUser: true },
  { rank: 5, name: 'Puzzle Master John', score: 13000, cases: 39, isCurrentUser: false },
  { rank: 6, name: 'Investigation Expert', score: 12500, cases: 37, isCurrentUser: false },
  { rank: 7, name: 'Case Solver Anna', score: 12000, cases: 36, isCurrentUser: false },
  { rank: 8, name: 'Detective Holmes', score: 11500, cases: 35, isCurrentUser: false },
];

const LeaderboardScreen: React.FC<any> = ({ navigation }) => {
  const { userProfile } = useAppSelector((state) => state.auth);
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('global');

  const renderLeaderboardItem = ({ item, index }: { item: LeaderboardEntry; index: number }) => {
    const getMedalIcon = (rank: number): string => {
      switch (rank) {
        case 1:
          return '🥇';
        case 2:
          return '🥈';
        case 3:
          return '🥉';
        default:
          return `#${rank}`;
      }
    };

    return (
      <Card
        style={[
          styles.leaderboardItem,
          ...(item.isCurrentUser ? [styles.currentUserItem] : []),
        ] as any}
        variant={item.isCurrentUser ? 'elevated' : 'default'}
      >
        <View style={styles.itemContent}>
          <View style={styles.rankContainer}>
            <Text style={styles.medalIcon}>{getMedalIcon(item.rank)}</Text>
          </View>

          <View style={styles.userInfo}>
            <Text
              style={[
                styles.userName,
                ...(item.isCurrentUser ? [styles.currentUserName] : []),
              ]}
            >
              {item.name}
            </Text>
            <Text style={styles.casesText}>
              {item.cases} cases solved
            </Text>
          </View>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>XP</Text>
            <Text
              style={[
                styles.score,
                item.isCurrentUser && styles.currentUserScore,
              ]}
            >
              {item.score.toLocaleString()}
            </Text>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Leaderboard</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Type Selector */}
      <View style={styles.typeSelector}>
        {(['global', 'weekly', 'monthly'] as LeaderboardType[]).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeButton,
              leaderboardType === type && styles.typeButtonActive,
            ]}
            onPress={() => setLeaderboardType(type)}
          >
            <Text
              style={[
                styles.typeButtonText,
                leaderboardType === type && styles.typeButtonTextActive,
              ]}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Your Rank Card */}
      {userProfile && (
        <Card style={styles.yourRankCard} variant="elevated">
          <View style={styles.yourRankContent}>
            <View>
              <Text style={styles.yourRankLabel}>Your Rank</Text>
              <Text style={styles.yourRank}>#4</Text>
            </View>
            <View style={styles.divider} />
            <View>
              <Text style={styles.yourRankLabel}>Total XP</Text>
              <Text style={styles.yourXP}>{userProfile.total_xp.toLocaleString()}</Text>
            </View>
            <View style={styles.divider} />
            <View>
              <Text style={styles.yourRankLabel}>Cases</Text>
              <Text style={styles.yourXP}>40</Text>
            </View>
          </View>
        </Card>
      )}

      {/* Leaderboard List */}
      <FlatList
        data={mockLeaderboard}
        renderItem={renderLeaderboardItem}
        keyExtractor={(item) => `${item.rank}`}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
      />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.PRIMARY_LIGHT,
  },
  backButton: {
    fontSize: 28,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  title: {
    ...TYPOGRAPHY.H2,
    color: COLORS.PRIMARY,
  },
  placeholder: {
    width: 28,
  },
  typeSelector: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  typeButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.DIVIDER,
    alignItems: 'center',
  },
  typeButtonActive: {
    borderBottomColor: COLORS.PRIMARY,
  },
  typeButtonText: {
    ...TYPOGRAPHY.BUTTON,
    color: COLORS.TEXT_SECONDARY,
  },
  typeButtonTextActive: {
    color: COLORS.PRIMARY,
  },
  yourRankCard: {
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  yourRankContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  yourRankLabel: {
    ...TYPOGRAPHY.CAPTION,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.xs,
  },
  yourRank: {
    ...TYPOGRAPHY.H3,
    color: COLORS.PRIMARY,
  },
  yourXP: {
    ...TYPOGRAPHY.H4,
    color: COLORS.SECONDARY,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.DIVIDER,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  leaderboardItem: {
    marginBottom: SPACING.sm,
  },
  currentUserItem: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  rankContainer: {
    width: 50,
    alignItems: 'center',
  },
  medalIcon: {
    fontSize: 24,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...TYPOGRAPHY.BUTTON,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.xs,
  },
  currentUserName: {
    color: COLORS.PRIMARY,
    fontWeight: '700',
  },
  casesText: {
    ...TYPOGRAPHY.CAPTION,
    color: COLORS.TEXT_SECONDARY,
  },
  scoreContainer: {
    alignItems: 'flex-end',
    minWidth: 70,
  },
  scoreLabel: {
    ...TYPOGRAPHY.CAPTION,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.xs,
  },
  score: {
    ...TYPOGRAPHY.H4,
    color: COLORS.SECONDARY,
  },
  currentUserScore: {
    color: COLORS.PRIMARY,
  },
});

export default LeaderboardScreen;