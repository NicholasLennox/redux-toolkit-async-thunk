import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchJoke = createAsyncThunk('joke/fetchJoke', async () => {
  const response = await fetch('https://icanhazdadjoke.com/', {
    headers: { Accept: 'application/json' }
  })
  const data = await response.json()
  return data.joke
})

const jokeSlice = createSlice({
  name: 'joke',
  initialState: {
    joke: null,
    // these two fields are the only addition to state
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJoke.pending, (state) => {
        // request is in flight - flag it, clear any previous error
        state.loading = true
        state.error = null
      })
      .addCase(fetchJoke.fulfilled, (state, action) => {
        // request succeeded - store the result, clear the flag
        state.loading = false
        state.joke = action.payload
      })
      .addCase(fetchJoke.rejected, (state, action) => {
        // request failed - store the message, clear the flag
        state.loading = false
        state.error = action.error.message
      })
  }
})

export default jokeSlice.reducer