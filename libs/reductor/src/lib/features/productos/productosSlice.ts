import { IProducto } from '@flash-ws/api-interfaces';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface ProductosState {
  productos?: IProducto[];
}

const initialState: ProductosState = {
  productos: undefined,
};

export const actualizarProductos: any = createAsyncThunk(
  'data/productos',
  async (httpClient: any) => {
    const response = await httpClient.get(
      `${process.env['NX_SERVER_URL']}/api/productos`
    );
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const productosSlice = createSlice({
  name: 'productos',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {},
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder.addCase(actualizarProductos.fulfilled, (state, action) => {
      state.productos = action.payload;
    });
  },
});

export default productosSlice.reducer;