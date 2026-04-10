import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { signOutUser } from '../../redux/slices/authSlice';
import { Button, Card } from '../../components';
import { showNotification } from '../../redux/slices/uiSlice';
import { COLORS, TYPOGRAPHY, SPACING } from '../../config/colors';

const ProfileScreen: React.FC<any> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { userProfile } = useAppSelector((state) => state.auth);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await dispatch(signOutUser()).unwrap();
      dispatch(
        showNotification({
          type: 'success',
          message: 'Logged out successfully',
        })
      );
    } catch (error: any) {
      dispatch(
        showNotification({
          type: 'error',
          message: error.message || 'Logout failed',
        })
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!userProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <Card style={styles.profileCard} variant="elevated">
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>🕵️</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.displayName}>{userProfile.display_name}</Text>
              <Text style={styles.email}>{userProfile.email}</Text>
            </View>
          </View>

          <View style={styles.premiumStatus}>
            {userProfile.premium_expiry ? (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumIcon}>👑</Text>
                <View>
                  <Text style={styles.premiumText}>Premium Member</Text>
                  <Text style={styles.premiumExpiry}>
                    Expires: {new Date(userProfile.premium_expiry).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ) : (
              <Button
                title="Upgrade to Premium"
                onPress={() => {
                  // Navigate to shop
                }}
                variant="secondary"
                size="small"
                fullWidth
              />
            )}
          </View>
        </Card>

        {/* Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="📊"
              label="Level"
              value={userProfile.level.toString()}
            />
            <StatCard
              icon="⭐"
              label="Total XP"
              value={userProfile.total_xp.toString()}
            />
            <StatCard
              icon="💎"
              label="Clues"
              value={userProfile.total_clues_owned.toString()}
            />
            <StatCard
              icon="📅"
              label="Joined"
              value={new Date(userProfile.created_at).toLocaleDateString()}
            />
          </View>
        </View>

        {/* Progress */}
        <Card style={styles.progressCard}>
          <Text style={styles.sectionTitle}>Level Progress</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.floor(((userProfile.total_xp % 1000) / 1000) * 100)}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {userProfile.total_xp % 1000} / 1000 XP to next level
          </Text>
        </Card>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionIcon}>🔔</Text>
            <Text style={styles.actionLabel}>Notifications</Text>
            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionIcon}>🎵</Text>
            <Text style={styles.actionLabel}>Sound & Music</Text>
            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionIcon}>ℹ️</Text>
            <Text style={styles.actionLabel}>About & Support</Text>
            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionLabel}>Privacy Policy</Text>
            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Leaderboard Button */}
        <Button
          title="View Leaderboard"
          onPress={() => navigation.navigate('Leaderboard')}
          variant="primary"
          fullWidth
          style={styles.leaderboardButton}
        />

        {/* Logout Button */}
        <Button
          title="Logout"
          onPress={handleLogout}
          isLoading={isLoggingOut}
          variant="danger"
          fullWidth
          style={styles.logoutButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => (
  <View style={styles.statCard}>
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...TYPOGRAPHY.BODY,
    color: COLORS.TEXT_SECONDARY,
  },
  profileCard: {
    marginBottom: SPACING.xl,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.PRIMARY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
  },
  avatarText: {
    fontSize: 40,
  },
  profileInfo: {
    flex: 1,
  },
  displayName: {
    ...TYPOGRAPHY.H3,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.xs,
  },
  email: {
    ...TYPOGRAPHY.BODY_SMALL,
    color: COLORS.TEXT_SECONDARY,
  },
  premiumStatus: {
    borderTopWidth: 1,
    borderTopColor: COLORS.DIVIDER,
    paddingTop: SPACING.lg,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
    backgroundColor: COLORS.SECONDARY_LIGHT,
    padding: SPACING.lg,
    borderRadius: 8,
  },
  premiumIcon: {
    fontSize: 32,
  },
  premiumText: {
    ...TYPOGRAPHY.BUTTON,
    color: COLORS.SECONDARY_DARK,
    marginBottom: SPACING.xs,
  },
  premiumExpiry: {
    ...TYPOGRAPHY.CAPTION,
    color: COLORS.SECONDARY_DARK,
  },
  statsSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.H3,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    padding: SPACING.lg,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statIcon: {
    fontSize: 32,
  },
  statValue: {
    ...TYPOGRAPHY.H4,
    color: COLORS.PRIMARY,
  },
  statLabel: {
    ...TYPOGRAPHY.CAPTION,
    color: COLORS.TEXT_SECONDARY,
  },
  progressCard: {
    marginBottom: SPACING.xl,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.DIVIDER,
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: SPACING.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.SUCCESS,
  },
  progressText: {
    ...TYPOGRAPHY.CAPTION,
    color: COLORS.TEXT_SECONDARY,
  },
  actionsSection: {
    marginBottom: SPACING.xl,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.DIVIDER,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: SPACING.lg,
  },
  actionLabel: {
    ...TYPOGRAPHY.BODY,
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  actionChevron: {
    ...TYPOGRAPHY.H3,
    color: COLORS.TEXT_SECONDARY,
  },
  leaderboardButton: {
    marginBottom: SPACING.lg,
  },
  logoutButton: {
    marginBottom: SPACING.xl,
  },
});

export default ProfileScreen;