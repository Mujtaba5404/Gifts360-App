import { BlurView } from '@react-native-community/blur';
import AntDesign from '@react-native-vector-icons/ant-design';
import React, { useEffect, useState } from 'react';
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { fontFamily } from '../assets/Fonts';
import images from '../assets/Images';
import { globalStyle } from '../assets/Styles';
import { height, width } from '../utils';
import { colors } from '../utils/colors';
import { fontSizes } from '../utils/fontSizes';

interface SelectElement {
    name: string;
    id?: string | null;
}

interface CustomSelectProps {
    inputWidth: number;
    inputHeight: number;
    selectElements: SelectElement[];
    borderColor: string;
    borderWidth: number;
    inputColor: string;
    borderRadius: number;
    onChangeText?: (value: string, id?: string | null) => void;
    setSelectedElement?: (value: string) => void;
    preselectedValue?: string | null;
    placeholder?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
    inputWidth,
    inputHeight,
    selectElements,
    borderColor,
    borderWidth,
    inputColor,
    borderRadius,
    onChangeText,
    setSelectedElement,
    preselectedValue,
    placeholder = 'Select',
}) => {
    const [selectElem, setSelectElem] = useState<string>(
        preselectedValue || selectElements[0]?.name || '',
    );
    const [selectPop, setSelectPop] = useState<boolean>(false);

    useEffect(() => {
        if (preselectedValue !== undefined && preselectedValue !== selectElem) {
            setSelectElem(preselectedValue || '');
        }
    }, [preselectedValue]);

    const handleSelect = (elm: SelectElement) => {
        setSelectElem(elm.name);
        setSelectPop(false);
        onChangeText?.(elm.name, elm.id);
        setSelectedElement?.(elm.name);
    };

    return (
        <>
            <View
                style={[
                    globalStyle.TextInputMain,
                    {
                        height: inputHeight,
                        width: inputWidth,
                        borderWidth: borderWidth,
                        borderColor: borderColor,
                        backgroundColor: inputColor,
                        borderRadius: borderRadius,
                    },
                ]}
            >
                <TouchableOpacity
                    style={globalStyle.selectInput}
                    onPress={() => setSelectPop(true)}
                    activeOpacity={0.8}
                >
                    <Text style={globalStyle.selectText}>
                        {selectElem || placeholder}
                    </Text>
                    <Image source={images.arrowdown} style={styles.icon} />
                </TouchableOpacity>
            </View>

            <Modal
                animationType="fade"
                transparent
                visible={selectPop}
                onRequestClose={() => setSelectPop(false)}
            >
                <TouchableWithoutFeedback onPress={() => setSelectPop(false)}>
                    <View style={styles.overlay}>
                        <BlurView
                            blurType="light"
                            blurAmount={10}
                            reducedTransparencyFallbackColor="white"
                            style={styles.blurView}
                        />
                        <TouchableWithoutFeedback>
                            <View style={styles.selectPopMain}>
                                <ScrollView
                                    contentContainerStyle={{ paddingVertical: 10 }}
                                    showsVerticalScrollIndicator={false}
                                >
                                    {selectElements.map((elm, index) => (
                                        <TouchableOpacity
                                            key={elm.id ?? `select-${index}`}
                                            style={[
                                                styles.selectTab,
                                                elm.name === selectElem && styles.selectedTab,
                                            ]}
                                            onPress={() => handleSelect(elm)}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={styles.selectTabText}>{elm.name}</Text>
                                            {elm.name === selectElem && (
                                                <AntDesign
                                                    name="check"
                                                    size={15}
                                                    color={colors.black}
                                                />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        width,
        height,
        alignItems: 'center',
        justifyContent: 'center',
    },
    blurView: {
    ...StyleSheet.absoluteFill,
},
    selectPopMain: {
        backgroundColor: colors.white,
        width: width * 0.85,
        maxHeight: height * 0.6,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 8,
    },
    selectTab: {
        height: 50,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectedTab: {
        backgroundColor: colors.lightGray,
    },
    selectTabText: {
        fontSize: fontSizes.sm2,
        fontFamily: fontFamily.GilroyMedium,
        color: colors.black,
    },
    icon: {
        width: width * 0.03,
        height: width * 0.03,
        resizeMode: 'contain',
    },
});

export default CustomSelect;