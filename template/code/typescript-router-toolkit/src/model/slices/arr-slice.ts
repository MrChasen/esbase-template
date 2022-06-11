import { createSlice } from '@reduxjs/toolkit';

export const arrSlice = createSlice({
  name: 'testArr',
  initialState: [
    'css',
    'html',
    'javascript',
    'typescript',
    'vue',
    'react',
    'node',
  ],
  reducers: {
    unshiftItem(state) {
      state.unshift('test');
    },
    shiftItem(state) {
      state.shift('test');
    },
  },
});

export const { unshiftItem, shiftItem } = arrSlice.actions;

export default arrSlice.reducer;
