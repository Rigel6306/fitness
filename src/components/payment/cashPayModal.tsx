import { Ionicons } from "@expo/vector-icons";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";

import { subscribeToPaymentListner } from "@/services/paymentService";
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";

interface CashPayModalProps {
    isModalVisible: boolean;
    setModalVisible: Dispatch<SetStateAction<boolean>>;
    userData: any;
    deskPhoneNumber?: string; // optional desk contact
}

const QR_TTL_SECONDS = 5 * 60; // 5 minute expiry window
type TokenType = {
    userId: string,
    docId: string,
    createdAt: string
}

const CashPayModal = ({
    isModalVisible,
    setModalVisible,
    userData,
}: CashPayModalProps) => {
    const { width: screenWidth } = useWindowDimensions();

    const isSmallDevice = screenWidth < 375;
    const qrSize = isSmallDevice ? 130 : 200;
    const cardWidth = screenWidth > 450 ? 400 : "92%";
    
    // QR token — refreshes on mount and on manual refresh
    const [qrToken, setQrToken] = useState<string>();
    const [isExpired, setIsExpired] = useState<boolean>(false);
    const [paymentStatus, setPaymentStatus] = useState<string>('');

    const generateDocId = () => {
        const now = Date.now();
        const random = Math.floor(Math.random() * 1000000);
        return `${now}_${random}`;
    };

    const generateToken = useCallback(() => {
        const token = {
            userId: userData.id,
            docId: generateDocId(),
            createdAt: new Date().toISOString()
        };

        console.log("Token", token);
        setQrToken(JSON.stringify(token));
    }, [userData?.id]);

    console.log("Payment Status", paymentStatus);

    useEffect(() => {
        if (!qrToken) return;

        const parsedToken = JSON.parse(qrToken) as TokenType;
        const unsubscribe = subscribeToPaymentListner(parsedToken.docId, setPaymentStatus);

        return unsubscribe;
    }, [isModalVisible, qrToken]);

    useEffect(() => {
        if (isModalVisible) {
            generateToken();
            setPaymentStatus(''); // Reset status on open
        }
    }, [isModalVisible]);

    const handleClose = () => {
        setModalVisible(false);
    };

    const splitName = (fullName: string = "") => {
        const parts = fullName.trim().split(" ");
        return { firstName: parts[0] || "", lastName: parts.slice(1).join(" ") || "" };
    };
    const { firstName, lastName } = splitName(userData?.name);

    const STEPS = [
        { icon: "qr-code-outline", label: "Show QR to staff" },
        { icon: "cash-outline", label: "Pay the amount" },
        { icon: "checkmark-circle-outline", label: "Await approval" },
    ];

    // Helper to render dynamic content in the central QR slot
    const renderQRSectionContent = () => {
        const dynamicContainerSize = { width: qrSize + 28, height: qrSize + 28 };

        if (paymentStatus === 'pending') {
            return (
                <View style={[styles.statusContainer, dynamicContainerSize, styles.pendingContainer]}>
                    <ActivityIndicator size="large" color="#4ADE80" />
                    <Text style={styles.statusTitle}>Processing Payment...</Text>
                    <Text style={styles.statusSubtitle}>Verifying your details at the desk</Text>
                </View>
            );
        }

        if (paymentStatus === 'completed') {
            return (
                <View style={[styles.statusContainer, dynamicContainerSize, styles.completedContainer]}>
                    <View style={styles.successIconCircle}>
                        <Ionicons name="checkmark-sharp" size={32} color="#0a0c0e" />
                    </View>
                    <Text style={styles.statusTitle}>Payment Verified</Text>
                    <Text style={styles.statusSubtitle}>Thank you for your payment!</Text>
                </View>
            );
        }

        if (isExpired) {
            return (
                <View style={[styles.qrWrapper, dynamicContainerSize, styles.expiredOverlay]}>
                    <Ionicons name="timer-outline" size={32} color="#f87171" />
                    <Text style={styles.expiredText}>QR Expired</Text>
                    <Text style={styles.expiredHint}>Tap "Refresh QR" below</Text>
                </View>
            );
        }

        if (qrToken) {
            return (
                <View style={styles.qrWrapper}>
                    <QRCode
                        value={qrToken}
                        size={qrSize}
                        quietZone={8}
                        backgroundColor="#FFFFFF"
                        color="#030305"
                    />
                </View>
            );
        }

        return (
            <View style={[styles.qrWrapper, dynamicContainerSize, styles.loadingWrapper]}>
                <Text style={styles.loadingText}>Loading…</Text>
            </View>
        );
    };

    return (
        <Modal
            transparent={false}
            visible={isModalVisible}
            animationType="slide"
            onRequestClose={handleClose}
            statusBarTranslucent
        >
            <SafeAreaView style={styles.viewport} edges={["top", "bottom"]}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={styles.headerIcon}>
                            <Ionicons name="wallet-outline" size={18} color="#4ADE80" />
                        </View>
                        <View>
                            <Text style={styles.headerTitle}>Cash Payment</Text>
                            <Text style={styles.headerSubtitle}>Scan at front desk</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={handleClose}
                        style={styles.closeBtn}
                        activeOpacity={0.7}
                        accessibilityLabel="Close modal"
                    >
                        <Ionicons name="close" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scroll}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={[styles.card, { width: cardWidth }]}>
                        {/* Summary Row */}
                        <View style={styles.summaryRow}>
                            <View>
                                <Text style={styles.summaryLabel}>Amount Due</Text>
                                <Text style={styles.summaryAmount}>
                                    Rs {userData?.package?.price || "0"}.00
                                </Text>
                            </View>
                            <View style={{ alignItems: "flex-end" }}>
                                <Text style={styles.summaryLabel}>Member</Text>
                                <Text style={styles.summaryName}>
                                    {firstName} {lastName}
                                </Text>
                                <Text style={styles.summaryPlan}>
                                    {userData?.package?.name || "Standard Plan"}
                                </Text>
                            </View>
                        </View>

                        {/* Centered Dynamic Content Slot */}
                        <View style={styles.qrSection}>
                            {renderQRSectionContent()}
                        </View>

                        {/* Steps */}
                        <View style={styles.stepsRow}>
                            {STEPS.map((step, i) => (
                                <View key={i} style={styles.stepItem}>
                                    <View style={styles.stepIconWrap}>
                                        <Ionicons
                                            name={step.icon as any}
                                            size={16}
                                            color="#4ADE80"
                                        />
                                    </View>
                                    <Text style={styles.stepNumber}>Step {i + 1}</Text>
                                    <Text style={styles.stepLabel}>{step.label}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>

                {/* Footer Notice */}
                <View style={styles.footer}>
                    <Ionicons name="information-circle-outline" size={14} color="#ffb03a" />
                    <Text style={styles.footerText}>
                        QR refreshes every 5 minutes. Do not screenshot — tokens are single-use.
                    </Text>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    viewport: {
        flex: 1,
        backgroundColor: "#0a0c0e",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 18,
        paddingVertical: 14,
        borderBottomWidth: 0.5,
        borderBottomColor: "rgba(255,255,255,0.06)",
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    headerIcon: {
        width: 34,
        height: 34,
        borderRadius: 9,
        backgroundColor: "rgba(74,222,128,0.1)",
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#FFFFFF",
        letterSpacing: 0.2,
    },
    headerSubtitle: {
        fontSize: 11,
        color: "#6B7280",
        marginTop: 1,
    },
    closeBtn: {
        backgroundColor: "rgba(255,255,255,0.05)",
        padding: 7,
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: "rgba(255,255,255,0.08)",
    },
    scroll: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
    },
    card: {
        backgroundColor: "rgba(255,255,255,0.02)",
        borderWidth: 0.5,
        borderColor: "rgba(255,255,255,0.07)",
        borderRadius: 20,
        padding: 18,
        alignSelf: "center",
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        backgroundColor: "rgba(255,255,255,0.02)",
        borderWidth: 0.5,
        borderColor: "rgba(255,255,255,0.06)",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 14,
    },
    summaryLabel: {
        fontSize: 10,
        color: "#6B7280",
        textTransform: "uppercase",
        letterSpacing: 0.6,
        marginBottom: 3,
    },
    summaryAmount: {
        fontSize: 20,
        fontWeight: "800",
        color: "#4cddbb",
        letterSpacing: -0.3,
    },
    summaryName: {
        fontSize: 13,
        fontWeight: "600",
        color: "#FFFFFF",
    },
    summaryPlan: {
        fontSize: 11,
        color: "#6B7280",
        marginTop: 2,
    },
    stepsRow: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 18,
    },
    stepItem: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.02)",
        borderWidth: 0.5,
        borderColor: "rgba(255,255,255,0.06)",
        borderRadius: 10,
        padding: 9,
        alignItems: "center",
    },
    stepIconWrap: {
        marginBottom: 5,
    },
    stepNumber: {
        fontSize: 9,
        color: "#6B7280",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    stepLabel: {
        fontSize: 11,
        color: "#D1D5DB",
        textAlign: "center",
        lineHeight: 15,
    },
    qrSection: {
        alignItems: "center",
        marginBottom: 14,
    },
    qrWrapper: {
        backgroundColor: "#FFFFFF",
        padding: 14,
        borderRadius: 14,
    },
    loadingWrapper: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F3F4F6",
    },
    expiredOverlay: {
        backgroundColor: "rgba(248,113,113,0.06)",
        borderWidth: 0.5,
        borderColor: "rgba(248,113,113,0.2)",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    expiredText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#f87171",
    },
    expiredHint: {
        fontSize: 11,
        color: "#9CA3AF",
    },
    loadingText: {
        fontSize: 12,
        color: "#6B7280",
    },
    footer: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
        paddingHorizontal: 18,
        paddingVertical: 12,
        backgroundColor: "rgba(255,176,58,0.04)",
        borderTopWidth: 0.5,
        borderTopColor: "rgba(255,176,58,0.12)",
    },
    footerText: {
        flex: 1,
        fontSize: 11,
        color: "#ffb03a",
        lineHeight: 16,
    },

    // New Status Screens Styling
    statusContainer: {
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        borderWidth: 0.5,
    },
    pendingContainer: {
        backgroundColor: "rgba(74, 222, 128, 0.03)",
        borderColor: "rgba(74, 222, 128, 0.2)",
        gap: 12,
    },
    completedContainer: {
        backgroundColor: "rgba(76, 221, 187, 0.05)",
        borderColor: "rgba(76, 221, 187, 0.3)",
        gap: 12,
    },
    successIconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#4cddbb",
        alignItems: "center",
        justifyContent: "center",
    },
    statusTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#FFFFFF",
        textAlign: "center",
    },
    statusSubtitle: {
        fontSize: 12,
        color: "#9CA3AF",
        textAlign: "center",
        paddingHorizontal: 10,
    },
});

export default CashPayModal;