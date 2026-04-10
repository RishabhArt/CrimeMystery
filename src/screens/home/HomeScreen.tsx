import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchAllCases } from '../../redux/slices/gameSlice';
import { COLORS, TYPOGRAPHY, SPACING } from '../../config/colors';

const HomeScreen: React.FC<any> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { cases, isLoading } = useAppSelector((state) => state.game);

  useEffect(() => {
    dispatch(fetchAllCases());
  }, [dispatch]);

  const renderCaseItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.caseCard}
      onPress={() => {
        // Navigate to case detail
      }}
    >
      <View style={styles.caseImagePlaceholder}>
        <Text style={styles.caseEmoji}>🕵️</Text>
      </View>
      <View style={styles.caseContent}>
        <Text style={styles.caseTitle}>{item.title}</Text>
        <Text style={styles.caseDescription}>{item.description}</Text>
        <View style={styles.caseFooter}>
          <Text style={styles.caseDifficulty}>{item.difficulty}</Text>
          <Text style={styles.caseChapters}>{item.total_chapters} Chapters</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Crime Cases</Text>
        <Text style={styles.subtitle}>Select a case to solve</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      ) : (
        <FlatList
          data={cases}
          renderItem={renderCaseItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.H2,
    color: COLORS.PRIMARY,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.BODY,
    color: COLORS.TEXT_SECONDARY,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    gap: SPACING.lg,
  },
  caseCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  caseImagePlaceholder: {
    width: 100,
    height: 120,
    backgroundColor: COLORS.PRIMARY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caseEmoji: {
    fontSize: 40,
  },
  caseContent: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'space-between',
  },
  caseTitle: {
    ...TYPOGRAPHY.H4,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.sm,
  },
  caseDescription: {
    ...TYPOGRAPHY.BODY_SMALL,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.md,
  },
  caseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  caseDifficulty: {
    ...TYPOGRAPHY.CAPTION,
    color: COLORS.SECONDARY,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  caseChapters: {
    ...TYPOGRAPHY.CAPTION,
    color: COLORS.TEXT_SECONDARY,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;