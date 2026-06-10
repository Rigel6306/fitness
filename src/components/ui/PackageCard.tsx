import { Colors } from "@/constants/Colors";
import { packageIcons } from "@/constants/icon";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

interface packageCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  icons: any[];
  isSelected: boolean;
  handleSelect: (data: any) => void;
  onClose?: () => void;
}

const { textSecondary, textPimary } = Colors;
type IconKey = keyof typeof packageIcons;

const PackageCard: React.FC<packageCardProps> = React.memo(({ 
  isSelected, 
  handleSelect, 
  onClose, 
  name, 
  description, 
  price, 
  icons, 
  id 
}) => {

  return (
    <Pressable
      onPress={() => { 
        handleSelect({ name, id, price });
        if (onClose) onClose();
      }}
      style={({ pressed }) => [pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] }, { width: '100%' }]}
    >
      <View style={[
        styles.packageCardContainer, 
        isSelected ? styles.cardActive : styles.cardInactive
      ]}>
        
        {/* RE-ARCHITECTED STACKED HEADER TO PREVENT BREAKS */}
        <View style={styles.pkgHeaderBlock}>
          {/* Top Row: Full Name expansion space */}
          <Text style={styles.packageName} numberOfLines={2} ellipsizeMode="tail">
            {name.toUpperCase()}
          </Text>
          
          {/* Bottom Row: Price aligned next to Selection Badge */}
          <View style={styles.metaInfoRow}>
            <Text style={[styles.packagePrice, isSelected && { color: '#0affca' }]}>
              RS. {price} <Text style={styles.perMonthLabel}>/ MO</Text>
            </Text>
            
            {isSelected && (
              <View style={styles.selectedBadge}>
                <Text style={styles.selectedBadgeText}>SELECTED</Text>
              </View>
            )}
          </View>
        </View>

        {/* Description Segment */}
        <Text style={styles.packageDescription} numberOfLines={3} ellipsizeMode="tail">
          {description}
        </Text>

        {/* Dynamic Vector Feature Trays */}
        <View style={styles.iconsContainer}>
          {icons.map((Icon: any, i: number) => {
            const RenderedIcon = packageIcons[Icon as IconKey];
            if (!RenderedIcon) return null;

            return (
              <View key={i} style={[
                styles.iconBubble,
                isSelected ? styles.iconBubbleActive : styles.iconBubbleInactive
              ]}>
                {React.cloneElement(RenderedIcon({}), { 
                  size: 14, 
                  color: isSelected ? "#0affca" : "rgba(255, 255, 255, 0.35)" 
                })}
              </View>
            );
          })}
        </View>

      </View>
    </Pressable>
  );
});

// --- STYLESHEET ---

const styles = StyleSheet.create({
  packageCardContainer: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#07070a',
  },
  cardInactive: {
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardActive: {
    borderColor: 'rgba(10, 255, 202, 0.4)',
    backgroundColor: 'rgba(28, 72, 152, 0.72)',
 
   
  },
  pkgHeaderBlock: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
    gap: 6,
  },
  packageName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  metaInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  packagePrice: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  perMonthLabel: {
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 10,
    fontWeight: '500',
  },
  selectedBadge: {
    backgroundColor: 'rgba(10, 255, 202, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(10, 255, 202, 0.3)',
  },
  selectedBadgeText: {
    color: '#0affca',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  packageDescription: {
    marginTop: 12,
    marginBottom: 14,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.45)',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBubble: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  iconBubbleInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  iconBubbleActive: {
    backgroundColor: 'rgba(10, 255, 202, 0.05)',
    borderColor: 'rgba(10, 255, 202, 0.2)',
  }
});

export default PackageCard;