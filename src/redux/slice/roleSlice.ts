import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ServiceItem {
  _id: string;
  name: string;
  text: string;
  charge: string;
  image: { uri: string };
}

interface ServicesState {
  homeServices: ServiceItem[];
  shopServices: ServiceItem[];
}

interface UserProfile {
  _id?: string;
  profilePic?: string | null;
  email?: string;
  phoneNumber?: string;
  bio?: string;
  gender?: string;
  dateOfBirth?: string;
  fullName?: string;
}

interface AppLocation {
  latitude: number;
  longitude: number;
}

interface AppAddress {
  country: string;
  countryCode: string;
  state: string;
  city: string;
  postalCode?: string;
}

interface UserSettings {
  _id: string;
  userId: string;
  isNotificationEnabled: boolean;
  isPetEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface RoleState {
  selectedRole: any | number | null;
  user: any;
  userAuthToken: any;
  token: any;
  pushNotificationToken: string | null;
  userEmail: string;
  isLogin: boolean;
  fullName: string;
  profileUser: UserProfile | null;
  userId: string;
  serviceId: string;
  services: ServicesState;
  profilePic: any;
  freelancerId: string;
  freelancerName: string;
  freelancerLocation: string;
  freelancerRating: string;
  specialOfferName: string;
  specialOfferPrice: string;
  chatId: string;
  languageSelect: string;
  currentLocation: AppLocation | null;
  currentAddress: AppAddress | null;
  locationPermissionGranted: boolean | null;
  locationError: string;
  refreshToken: string | null;
  documents: any | null;
  settings: UserSettings | null;
}

const initialState: RoleState = {
  selectedRole: null,
  user: {},
  userAuthToken: '',
  token: '',
  pushNotificationToken: null,
  userEmail: '',
  isLogin: false,
  fullName: '',
  profileUser: null,
  userId: '',
  serviceId: '',
  services: {
    homeServices: [],
    shopServices: [],
  },
  profilePic: null,
  freelancerId: '',
  freelancerName: '',
  freelancerLocation: '',
  freelancerRating: '',
  specialOfferName: '',
  specialOfferPrice: '',
  chatId: '',
  languageSelect: '',
  currentLocation: null,
  currentAddress: null,
  locationPermissionGranted: null,
  locationError: '',
  refreshToken: null,
  documents: null,
  settings: null,
} satisfies RoleState as RoleState;

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<string | number>) => {
      state.selectedRole = action.payload;
    },
    clearRole: state => {
      state.selectedRole = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.userAuthToken = action.payload;
      state.token = action.payload;
    },
    setPushNotificationToken: (state, action: PayloadAction<string | null>) => {
      state.pushNotificationToken = action.payload;
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    setLogin: state => {
      state.isLogin = true;
    },
    setUserEmail: (state, action) => {
      state.userEmail = action.payload;
    },
    setFullName: (state, action) => {
      state.fullName = action.payload;
    },
    removeUser: state => {
      state.user = {};
      state.userAuthToken = null;
      state.token = null;
      state.isLogin = false;
      state.documents = null;
    },
    setDocuments: (state, action: PayloadAction<any | null>) => {
      state.documents = action.payload;
    },
    setUserProfiles: (state, action: PayloadAction<UserProfile>) => {
      state.profileUser = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setServiceId: (state, action) => {
      state.serviceId = action.payload;
    },
    setFreelancerId: (state, action) => {
      state.freelancerId = action.payload;
    },
    setServices: (state, action: PayloadAction<ServicesState>) => {
      state.services = action.payload;
    },
    setHomeServices: (state, action: PayloadAction<ServiceItem[]>) => {
      state.services.homeServices = action.payload;
    },
    setShopServices: (state, action: PayloadAction<ServiceItem[]>) => {
      state.services.shopServices = action.payload;
    },
    setProfilePic: (state, action) => {
      state.profilePic = action.payload;
    },
    setFreelancerName: (state, action) => {
      state.freelancerName = action.payload;
    },
    setFreelancerLocation: (state, action) => {
      state.freelancerLocation = action.payload;
    },
    setFreelancerRating: (state, action) => {
      state.freelancerRating = action.payload;
    },
    setSpecialOfferName: (state, action) => {
      state.specialOfferName = action.payload;
    },
    setSpecialOfferPrice: (state, action) => {
      state.specialOfferPrice = action.payload;
    },
    setChatId: (state, action) => {
      state.chatId = action.payload;
    },
    setLanguageSelect: (state, action) => {
      state.languageSelect = action.payload;
    },
    setCurrentLocation: (state, action: PayloadAction<AppLocation | null>) => {
      state.currentLocation = action.payload;
    },
    setCurrentAddress: (state, action: PayloadAction<AppAddress | null>) => {
      state.currentAddress = action.payload;
    },
    setLocationPermissionGranted: (
      state,
      action: PayloadAction<boolean | null>,
    ) => {
      state.locationPermissionGranted = action.payload;
    },
    setLocationError: (state, action: PayloadAction<string>) => {
      state.locationError = action.payload;
    },
    setSettings: (state, action: PayloadAction<UserSettings | null>) => {
      state.settings = action.payload;
    },
  },
});

export const {
  setRole,
  clearRole,
  setUser,
  setToken,
  setPushNotificationToken,
  setRefreshToken,
  setLogin,
  setUserEmail,
  removeUser,
  setFullName,
  setUserProfiles,
  setUserId,
  setServiceId,
  setServices,
  setHomeServices,
  setShopServices,
  setProfilePic,
  setFreelancerId,
  setFreelancerName,
  setFreelancerLocation,
  setFreelancerRating,
  setSpecialOfferPrice,
  setSpecialOfferName,
  setChatId,
  setLanguageSelect,
  setCurrentLocation,
  setCurrentAddress,
  setLocationPermissionGranted,
  setLocationError,
  setDocuments,
  setSettings,
} = roleSlice.actions;
export default roleSlice.reducer;