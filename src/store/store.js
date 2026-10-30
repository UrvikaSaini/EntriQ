
import { configureStore } from "@reduxjs/toolkit";
import parkingReducer from "./parkingSlice";
import complaintsReducer from "./complaintsSlice";

export const store = configureStore({
  reducer: {
    parking: parkingReducer,
    complaints: complaintsReducer,
  },
});
