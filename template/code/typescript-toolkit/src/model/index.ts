import { configureStore } from '@reduxjs/toolkit';
import counterSlice from './slices/count-slice';
import arrSlice from './slices/arr-slice';

export default configureStore({
  reducer: {
    counter: counterSlice,
    testArr: arrSlice,
  },
});
