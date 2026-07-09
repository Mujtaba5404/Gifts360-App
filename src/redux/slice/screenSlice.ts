import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ScreenState {
  screen: string | null;
}

const initialState: ScreenState = {
  screen: null,
};

const screenSlice = createSlice({
  name: 'screen',
  initialState,
  reducers: {
    setScreen: (state, action: PayloadAction<string | null>) => {
      state.screen = action.payload;
    },
    showLoader: (state, action: PayloadAction<string | null>) => {
      state.screen = action.payload;
    },
    hideLoader: (state, action: PayloadAction<string | null>) => {
      state.screen = action.payload;
    },
  },
});

export const { setScreen, showLoader, hideLoader } = screenSlice.actions;
export default screenSlice.reducer;