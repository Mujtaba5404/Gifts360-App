import {
    ParamListBase,
    createNavigationContainerRef,
} from '@react-navigation/native';
import { Dimensions, Platform } from 'react-native';

const { width, height }: { width: number; height: number } =
    Dimensions.get('window');

const isAndroid: boolean = Platform.OS === 'android';
const isIOS: boolean = Platform.OS === 'ios';

export const navigationRef = createNavigationContainerRef<ParamListBase>();

export { height, isAndroid, isIOS, width };