import { Colors } from '@/constants/Colors';
import { useUserDataContext } from '@/hooks/useContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const { textPimary, textSecondary, secondaryBackground, primaryBackground, cardBackground } = Colors
const WeightTargetModal = ({ isModalOpen, setIsModalOpen }) => {


    const calProgress = (startWeight: number, currentWeight: number, targetWeight: number): number => {

        const totalChange = Math.abs(targetWeight - startWeight)
        const achievedChange = Math.abs(currentWeight - startWeight)
        return Math.min((achievedChange / totalChange) * 100, 100)
    }

    const { weightData, setWeightData } = useUserDataContext()

    const progress = calProgress(weightData.startWeight, weightData.currentWeight, weightData.targetWeight)



    return (
        <Modal
            visible={isModalOpen}
            transparent={true}
            animationType='slide'
            onRequestClose={() => { setIsModalOpen(!isModalOpen) }}
        >
            <View style={styles.container}>
                <View style={styles.headingContainer}>
                    <Pressable style={({ pressed }) => [pressed && { opacity: 0.5 }]} onPress={() => setIsModalOpen(!isModalOpen)}>
                        <Ionicons name="chevron-back" size={24} color={textPimary} />
                    </Pressable >
                    <Text style={{ textAlign: 'center', fontSize: 20, color: textPimary, fontWeight: 'bold' }}>Weight Goals</Text>
                    <Pressable style={({ pressed }) => [pressed && { opacity: 0.5 }]} onPress={() => setIsModalOpen(!isModalOpen)} >
                        <Ionicons name="close-circle-sharp" size={24} color={textPimary} />
                    </Pressable>
                </View>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <ScrollView style={styles.bodyContainer}>
                        {/* Curent Progress Card */}
                        <View style={styles.curentProgress}>
                            <View style={styles.progressHeading}>
                                <Text style={{ color: textPimary, fontSize: 19, fontWeight: 'bold' }}>Current Progress</Text>
                                <Text style={{ color: textPimary, borderRadius: 20, padding: 7, backgroundColor: cardBackground, fontSize: 11, fontWeight: 'bold' }}>{weightData.weightLoss ? "Losing Weight" : "Gaining Weight"}</Text>
                            </View>
                            <View style={styles.weightTargetContainer}>
                                <View style={styles.curentWeight}>
                                    <Text style={{ color: textSecondary, fontSize: 12, fontWeight: 'bold' }}>Current</Text>
                                    <Text style={{ color: textPimary, fontSize: 22, fontWeight: 'bold' }}>{weightData.currentWeight}Kg</Text>
                                </View>
                                <MaterialIcons name="keyboard-double-arrow-right" size={24} color="black" />
                                <View style={styles.targetWeight}>
                                    <Text style={{ color: textSecondary, fontSize: 12, fontWeight: 'bold' }}>Target</Text>
                                    <Text style={{ color: textPimary, fontSize: 22, fontWeight: 'bold' }}>{weightData.targetWeight}Kg</Text>
                                </View>
                            </View>

                            <View style={styles.progressBarContainer}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ color: textSecondary }}>0%</Text>
                                    <Text style={{ color: textSecondary }}>100%</Text>
                                </View>
                                <View style={styles.progressBar}>
                                    <View style={[styles.progressTrack, { width: `${progress}%` }]} />
                                </View>
                                <Text style={{ textAlign: 'center', color: textPimary, marginTop: 10, fontWeight: 'bold' }}>{progress.toFixed(1)}% Complete</Text>
                            </View>
                        </View>
                        {/* Weight Goal Update Section */}
                        <View style={styles.weightGoalFormContainer} >
                            <Text style={styles.goalHeadingText}>Set Your Weight Goal</Text>
                            <Text style={styles.goalSubText}>I Want to</Text>
                            <View style={styles.targetButtonContainer}>
                                <Pressable
                                    style={({ pressed }) => [pressed && { opacity: 0.5 },
                                    styles.targetButton,
                                    { backgroundColor: weightData.weightLoss ? cardBackground : secondaryBackground }]}
                                    onPress={() => setWeightData((prev) => ({ ...prev, "weightLoss": true }))}
                                >
                                    <Ionicons name="trending-down-outline" size={24} color="green" />
                                    <Text style={styles.targetButtonText} >Lose Weight</Text>
                                </Pressable>
                                <Pressable style={({ pressed }) => [pressed && { opacity: 0.5, },
                                styles.targetButton,
                                { backgroundColor: !weightData.weightLoss ? cardBackground : secondaryBackground }]}
                                    onPress={() => setWeightData((prev) => ({ ...prev, "weightLoss": false }))}
                                >
                                    <Ionicons name="trending-up-outline" size={24} color="crimson" />
                                    <Text style={styles.targetButtonText}>Gain Weight</Text>
                                </Pressable>
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLable}>Current Weight (KG)</Text>
                                <View style={styles.inputFieldContainer}>
                                    <MaterialCommunityIcons name="weight" size={24} color="black" />
                                    <TextInput
                                        placeholder='75'
                                        keyboardType='numeric'
                                        style={styles.inputField} />
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLable}>Target Weight (KG)</Text>
                                <View style={styles.inputFieldContainer}>
                                    <Ionicons name="flag-sharp" size={24} color="black" />
                                    <TextInput
                                        placeholder='75'
                                        keyboardType='numeric'
                                        style={styles.inputField} />
                                </View>
                            </View>

                            <View style={styles.actionButtonsContainer}>
                                <Pressable style={({ pressed }) => [pressed && { opacity: 0.5 }, styles.cancleBtn]}>
                                    <Text style={styles.targetButtonText} >Cancel</Text>
                                </Pressable>
                                <Pressable style={({ pressed }) => [pressed && { opacity: 0.5 }, styles.saveBtn]}>
                                    <Text style={styles.targetButtonText}>Save Changes</Text>
                                </Pressable>
                            </View>

                            <Text style={{ textAlign: 'center', color: textSecondary }}>Last Updated On: 2026-01-02</Text>

                        </View>





                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        backgroundColor: "#000000ff",
    },
    // Heading Section
    headingContainer: {
        flexDirection: 'row',
        padding: 10,
        alignItems: "center",
        justifyContent: 'space-between'

    },
    bodyContainer: {
        flex: 4,
        marginBottom: 20,

    },
    //progressCard
    curentProgress: {
        padding: 10,
        marginTop: 10,
        borderRadius: 20,
        backgroundColor: primaryBackground

    },
    progressHeading: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    weightTargetContainer: {
        marginTop: 20,
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'

    },
    curentWeight: {
        alignItems: "center",
        justifyContent: 'center'
    },
    targetWeight: {
        alignItems: "center",
        justifyContent: 'center'
    },
    progressBarContainer: {
        margin: 10,
    },
    progressBar: {
        backgroundColor: textSecondary,
        height: 10,
        marginTop: 10,
        borderRadius: 10
    },
    progressTrack: {
        height: '100%',
        borderRadius: 10,
        backgroundColor: cardBackground,

    },

    // Weight Goal Update Section
    weightGoalFormContainer: {
        padding: 10,
        marginTop: 10,
        borderRadius: 20,
        backgroundColor: primaryBackground
    },
    goalHeadingText: {
        padding: 10,
        fontSize: 19,
        color: textPimary,
        fontWeight: 'bold',

    },
    goalSubText: {
        padding: 10,
        fontSize: 15,
        color: textPimary,
        fontWeight: 'bold',

    },
    targetButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        margin: 10,

    },
    targetButton: {
        flexDirection: 'row',
        flex: 1,
        backgroundColor: secondaryBackground,
        padding: 20,
        alignItems: 'center',
        borderRadius: 10,
        justifyContent: 'center',
        gap: 10,
    },
    targetButtonText: {
        color: textPimary,
        fontWeight: 'bold',
    },
    inputContainer: {
        margin: 10,
        gap: 10
    },
    inputLable: {

        fontSize: 15,
        color: textPimary,
        fontWeight: 'bold',

    },
    inputFieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: textSecondary,
        borderRadius: 15,
        padding: 10,
    },
    inputField: {
        flex: 1,

        padding: 10,

    },

    // Action Buttons section
    actionButtonsContainer: {
        flexDirection: 'row',
        margin: 10,
        marginTop: 20,
        gap: 10,

    },

    cancleBtn: {

        flex: 1,
        backgroundColor: secondaryBackground,
        padding: 20,
        alignItems: 'center',
        borderRadius: 10,
        justifyContent: 'center',


    },
    saveBtn: {

        flex: 1,
        backgroundColor: cardBackground,
        padding: 20,
        alignItems: 'center',
        borderRadius: 10,
        justifyContent: 'center',


    },

})

export default WeightTargetModal