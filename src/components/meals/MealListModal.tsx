import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type MealListModalProps = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  mealType: string;
};

// Mock suggestions matching your programmatic array patterns
const SUGGESTED_FOODS = [
  { id: 'f1', name: 'Grilled Chicken Breast & Rice', protein: '42g', carbs: '45g', fats: '8g', kcal: 420 },
  { id: 'f2', name: 'Smoked Salmon & Avocado Toast', protein: '28g', carbs: '32g', fats: '18g', kcal: 402 },
  { id: 'f3', name: 'Oatmeal with Whey & Berries', protein: '35g', carbs: '52g', fats: '6g', kcal: 402 },
];

export default function MealListModal({ modalVisible, setModalVisible, mealType }: MealListModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          
          {/* Header Panel Layout Architecture */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalSubText}>Options for</Text>
              <Text style={styles.modalTitleText}>{mealType} Blueprint</Text>
            </View>
            <Pressable 
              style={styles.closeButton} 
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          {/* Recycler Area */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollList}>
            {SUGGESTED_FOODS.map((food) => (
              <View key={food.id} style={styles.foodItemCard}>
                <View style={styles.foodMetaTop}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Text style={styles.foodKcal}>{food.kcal} kcal</Text>
                </View>
                
                <View style={styles.macroRow}>
                  <View style={styles.macroTag}><Text style={styles.macroTagText}>P: {food.protein}</Text></View>
                  <View style={styles.macroTag}><Text style={styles.macroTagText}>C: {food.carbs}</Text></View>
                  <View style={styles.macroTag}><Text style={styles.macroTagText}>F: {food.fats}</Text></View>
                  
                  <Pressable 
                    style={styles.logActionPill} 
                    onPress={() => setModalVisible(false)}
                  >
                    <MaterialCommunityIcons name="plus" size={14} color="#4cddbb" />
                    <Text style={styles.logActionText}>Log</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </ScrollView>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: '#030405D9', // Deep dark backdrop blur overlay
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0C0F0E',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.03)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.03)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '75%',
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  modalTitleText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  modalSubText: {
    fontSize: 11,
    color: '#8E9492',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollList: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  foodItemCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  foodMetaTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  foodName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  foodKcal: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  macroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  macroTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  macroTagText: {
    color: '#B0B5B3',
    fontSize: 11,
    fontWeight: '500',
  },
  logActionPill: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(76, 221, 187, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(76, 221, 187, 0.2)',
    borderRadius: 99,
  },
  logActionText: {
    color: '#4cddbb',
    fontWeight: '700',
    fontSize: 11,
  },
});