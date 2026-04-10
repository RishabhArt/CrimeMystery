import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { Button, Card } from '../../components';
import { showNotification } from '../../redux/slices/uiSlice';
import { COLORS, TYPOGRAPHY, SPACING } from '../../config/colors';
import { MONETIZATION_CONFIG } from '../../constants';

type ShopTab = 'clues' | 'premium' | 'cosmetics';

const ShopScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userProfile } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<ShopTab>('clues');
  const [selectedCluePackId, setSelectedCluePackId] = useState<string | null>(null);

  const handlePurchaseClues = (packId: string, clues: number, price: number) => {
    setSelectedCluePackId(packId);
    
    // Simulate purchase
    dispatch(
      showNotification({
        type: 'success',
        message: `Purchased ${clues} clues for ₹${price}!`,
      })
    );
    
    setTimeout(() => setSelectedCluePackId(null), 2000);
  };

  const renderCluePackItem = (item: any) => (
    <Card style={styles.packCard} variant="elevated">
      <View style={styles.packHeader}>
        <Text style={styles.packIcon}>💎</Text>
        <View style={styles.packInfo}>
          <Text style={styles.packAmount}>{item.clues} Clues</Text>
          <Text style={styles.packPrice}>{item.displayPrice}</Text>
        </View>
      </View>

      {item.discount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>Save {item.discount}</Text>
        </View>
      )}

      <Button
        title="Purchase"
        onPress={() =>
          handlePurchaseClues(item.id, item.clues, item.price)
        }
        variant="primary"
        size="small"
        fullWidth
        isLoading={selectedCluePackId === item.id}
        style={styles.purchaseButton}
      />
    </Card>
  );

  const renderPremiumTier = (key: string, tier: any) => (
    <Card key={key} style={styles.premiumCard} variant="elevated">
      <View style={styles.tierHeader}>
        <Text style={styles.tierName}>{key.toUpperCase()}</Text>
        <Text style={styles.tierPrice}>{tier.displayPrice}</Text>
      </View>

      <View style={styles.tierBenefits}>
        <BenefitRow icon="💎" text="Unlimited Clues" />
        <BenefitRow icon="⭐" text="Exclusive Cases" />
        <BenefitRow icon="🎨" text="Premium Skins" />
        <BenefitRow icon="🔔" text="Priority Support" />
      </View>

      <Button
        title="Subscribe Now"
        onPress={() => {
          dispatch(
            showNotification({
              type: 'info',
              message: `${key} subscription coming soon!`,
            })
          );
        }}
        variant="secondary"
        size="small"
        fullWidth
        style={styles.purchaseButton}
      />
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* User Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>💎</Text>
          <Text style={styles.statLabel}>Clues</Text>
          <Text style={styles.statValue}>
            {userProfile?.total_clues_owned || 0}
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>👑</Text>
          <Text style={styles.statLabel}>Status</Text>
          <Text style={styles.statValue}>
            {userProfile?.premium_expiry
              ? 'Premium'
              : 'Free'}
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>💰</Text>
          <Text style={styles.statLabel}>Spent</Text>
          <Text style={styles.statValue}>
            ₹{userProfile?.total_spent_amount || 0}
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {(['clues', 'premium', 'cosmetics'] as ShopTab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.tabActive,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'clues' && (
          <View>
            <Text style={styles.sectionTitle}>Purchase Clues</Text>
            <Text style={styles.sectionDescription}>
              Get hints to solve puzzles
            </Text>
            <FlatList
              data={MONETIZATION_CONFIG.CLUE_PACKS}
              renderItem={({ item }) => renderCluePackItem(item)}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={{ paddingHorizontal: SPACING.lg, paddingVertical: SPACING.lg }}
              ItemSeparatorComponent={() => <View style={{ height: SPACING.lg }} />}
            />
          </View>
        )}

        {activeTab === 'premium' && (
          <View>
            <Text style={styles.sectionTitle}>Premium Membership</Text>
            <Text style={styles.sectionDescription}>
              Unlock exclusive features
            </Text>
            {Object.entries(MONETIZATION_CONFIG.PREMIUM_TIERS).map(
              ([key, tier]) => renderPremiumTier(key, tier)
            )}
          </View>
        )}

        {activeTab === 'cosmetics' && (
          <View>
            <Text style={styles.sectionTitle}>Cosmetics</Text>
            <Text style={styles.sectionDescription}>
              Customize your detective
            </Text>
            <Card style={styles.comingSoonCard}>
              <Text style={styles.comingSoonIcon}>🎨</Text>
              <Text style={styles.comingSoonText}>Coming Soon!</Text>
              <Text style={styles.comingSoonDesc}>
                Detective skins and themes will be available soon
              </Text>
            </Card>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

interface BenefitRowProps {
  icon: string;
  text: string;
}

const BenefitRow: React.FC<BenefitRowProps> = ({ icon, text }) => (
  <View style={styles.benefitRow}>
    <Text style={styles.benefitIcon}>{icon}</Text>
    <Text style={styles.benefitText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statIcon: {
    fontSize: 24,
  },
  statLabel: {
    ...TYPOGRAPHY.CAPTION,
    color: COLORS.TEXT_SECONDARY,
  },
  statValue: {
    ...TYPOGRAPHY.H4,
    color: COLORS.PRIMARY,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.DIVIDER,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomColor: COLORS.PRIMARY,
  },
  tabText: {
    ...TYPOGRAPHY.BUTTON,
    color: COLORS.TEXT_SECONDARY,
  },
  tabTextActive: {
    color: COLORS.PRIMARY,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.H3,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.sm,
  },
  sectionDescription: {
    ...TYPOGRAPHY.BODY_SMALL,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.xl,
  },
  packCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  packHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  packIcon: {
    fontSize: 32,
  },
  packInfo: {
    flex: 1,
  },
  packAmount: {
    ...TYPOGRAPHY.H4,
    color: COLORS.TEXT_PRIMARY,
  },
  packPrice: {
    ...TYPOGRAPHY.BODY_SMALL,
    color: COLORS.TEXT_SECONDARY,
  },
  discountBadge: {
    backgroundColor: COLORS.SUCCESS,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    marginBottom: SPACING.md,
  },
  discountText: {
    ...TYPOGRAPHY.CAPTION,
    color: COLORS.SURFACE,
    fontWeight: '600',
  },
  purchaseButton: {
    marginTop: SPACING.md,
  },
  premiumCard: {
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
  },
  tierHeader: {
    marginBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.DIVIDER,
    paddingBottom: SPACING.lg,
  },
  tierName: {
    ...TYPOGRAPHY.H3,
    color: COLORS.PRIMARY,
    marginBottom: SPACING.xs,
  },
  tierPrice: {
    ...TYPOGRAPHY.H4,
    color: COLORS.SECONDARY,
  },
  tierBenefits: {
    marginVertical: SPACING.lg,
    gap: SPACING.md,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  benefitIcon: {
    fontSize: 20,
  },
  benefitText: {
    ...TYPOGRAPHY.BODY_SMALL,
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  comingSoonCard: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
  },
  comingSoonIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  comingSoonText: {
    ...TYPOGRAPHY.H3,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.sm,
  },
  comingSoonDesc: {
    ...TYPOGRAPHY.BODY_SMALL,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
});

export default ShopScreen;