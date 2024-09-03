import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  documentSidebar: false,
  trackingSidebar: false,
  excelSidebar: false,
};

const miscellaneousSlice = createSlice({
  name: "miscellaneous",
  initialState: initialState,
  reducers: {
    setMiscellaneous(state, action) {
      Object.keys(action.payload).forEach((key) => {
        state[key] = action.payload[key];
      });
    },
  },
});

export const { setMiscellaneous } = miscellaneousSlice.actions;
export default miscellaneousSlice.reducer;
