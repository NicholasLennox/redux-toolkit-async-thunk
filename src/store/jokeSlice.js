import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// createAsyncThunk takes two arguments:
// 1. a string that names this action - RTK uses it to generate the lifecycle types
//    fulfilled: 'joke/fetchJoke/fulfilled'
//    pending:   'joke/fetchJoke/pending'
//    rejected:  'joke/fetchJoke/rejected'
// 2. a function that does the async work and returns the result
//    whatever you return here becomes action.payload in the fulfilled case
export const fetchJoke = createAsyncThunk('joke/fetchJoke', async () => {
  const response = await fetch('https://icanhazdadjoke.com/', {
    headers: { Accept: 'application/json' }
  })
  const data = await response.json()
  // data = { id: '...', joke: '...', status: 200 }
  // we only care about the joke string
  return data.joke
})

const jokeSlice = createSlice({
  name: 'joke',
  initialState: { joke: null },
  reducers: {},
  // extraReducers handles actions that were defined outside this slice
  // our thunk lives above, not inside reducers - so it belongs here
  extraReducers: (builder) => {
    builder.addCase(fetchJoke.fulfilled, (state, action) => {
      // action.payload is whatever the thunk returned - the joke string
      state.joke = action.payload
    })
  }
})

export default jokeSlice.reducer