import { useEffect, useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { fontFamily } from '../assets/Fonts';
import { height } from '../utils';
import { colors } from '../utils/colors';
import { fontSizes } from '../utils/fontSizes';

const { width } = Dimensions.get('window');

interface CustomTabsProps {
    tabs: string[];
    tabContents: React.ComponentType[];
    activeTabLoad?: number;
}

const CustomTabs: React.FC<CustomTabsProps> = ({
    tabs,
    tabContents,
    activeTabLoad = 0,
}) => {
    const [activeTab, setActiveTab] = useState<number>(activeTabLoad);
    const TAB_WIDTH = (width * 0.85) / tabs.length;

    useEffect(() => {
        if (activeTabLoad !== undefined) {
            setActiveTab(activeTabLoad);
        }
    }, [activeTabLoad]);

    const renderActiveScreen = () => {
        const ActiveScreenComponent = tabContents[activeTab];
        return <ActiveScreenComponent />;
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.tabWrapper}>
                    <View style={styles.tabContainer}>
                        {tabs.map((tab, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.tab,
                                    activeTab === index && styles.tabActive,
                                    { width: TAB_WIDTH },
                                ]}
                                onPress={() => setActiveTab(index)}
                            >
                                <Text
                                    style={[
                                        styles.tabText,
                                        activeTab === index && styles.activeText,
                                    ]}
                                >
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.screenContainer}>{renderActiveScreen()}</View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    tabWrapper: {
        width: width * 0.85,
        height: height * 0.045,
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        alignSelf: 'center',
        backgroundColor: colors.lightGray,
        borderWidth: 1,
        borderColor: colors.white,
        paddingHorizontal: width * 0.02,
    },
    tabContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    tab: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabText: {
        fontSize: fontSizes.sm2,
        color: colors.black,
        fontFamily: fontFamily.GilroyMedium,
    },
    activeText: {
        fontSize: fontSizes.md,
        color: colors.white,
        fontFamily: fontFamily.GilroyMedium,
    },
    screenContainer: {
        height: height * 0.99,
        width: width,
    },
    tabActive: {
        backgroundColor: colors.marhoon,
        borderRadius: 30,
        height: height * 0.045,
        right: width * 0.025
    },
});

export default CustomTabs;