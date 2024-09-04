import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  loginLoader: false,
  registerLoader: false,
  loader: false, // Full dashboard screen loader

  getLoader: false, //login, getItem
  addLoader: false,
  updateLoader: false,
  deleteLoader: false,

  campaignLoader: {},
  downloadCampaignFileProgress: 0,

  templateLoader: false,
  reportsLoader: false,

  categoriesLoader: false,
};

const loadersSlice = createSlice({
  name: "loaders",
  initialState: initialState,
  reducers: {
    setLoader(state, action) {
      Object.keys(action.payload).forEach((key) => {
        state[key] = action.payload[key];
      });
    },

    setCampaignLoader(state, action) {
      state.campaignLoader[action.payload.campaignName] = action.payload;
    },

    removeCampaignLoader(state, action) {
      delete state.campaignLoader[action.payload.campaignName];
    },
  },
});

export const { setLoader, setCampaignLoader, removeCampaignLoader } =
  loadersSlice.actions;
export default loadersSlice.reducer;
