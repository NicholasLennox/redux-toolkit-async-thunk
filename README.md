# Redux Toolkit Intro - Async Thunk Demo (Complete Example)

## What this app does

Same app as the main branch - it fetches a dad joke and displays it. The difference is that this branch handles the full reality of a network request: it might be in flight, it might succeed, it might fail.

If you have not read the main branch README, start there. This branch builds directly on it.



## The reality of network requests

In the main branch we only handled `fulfilled` - the happy path. In a real app a network request has three possible states at any moment:

- it is in flight and we are waiting
- it came back with data
- it came back with an error

Your UI should reflect all three. A user staring at a blank screen does not know if the app is loading or broken. Handling these states is not extra complexity - it is basic honesty about what is happening.



## Multiple fields in one slice

Until now every slice has had one field in `initialState`. There is nothing special about that - it was just enough for the job. A slice can hold as many fields as the feature needs.

This slice now owns three:

```js
initialState: {
  joke: null,
  loading: false,
  error: null
}
```

`joke` is the data. `loading` and `error` are metadata - information about the state of the request itself, not the result. This is a common pattern. Whenever you fetch data you almost always want these three fields together because they answer three different questions the UI needs to ask:

- is something happening right now? - `loading`
- did something go wrong? - `error`
- what did we get? - `joke`

They live in the same slice because they all belong to the same feature. They change together, they are read together, and they describe the same thing.



## Handling all three lifecycle cases

Each lifecycle action has one job - set the flags correctly and nothing else:

```js
extraReducers: (builder) => {
  builder
    .addCase(fetchJoke.pending, (state) => {
      state.loading = true
      state.error = null
    })
    .addCase(fetchJoke.fulfilled, (state, action) => {
      state.loading = false
      state.joke = action.payload
    })
    .addCase(fetchJoke.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
}
```

Notice the symmetry. `pending` opens the gate - sets `loading` to true and clears any previous error. Both `fulfilled` and `rejected` close it - they set `loading` back to false and then do their own thing with the result. Every case has a clear, single responsibility.



## One thing to watch

In `fulfilled` the result lives at `action.payload` - that is whatever the thunk returned.

In `rejected` the error lives at `action.error.message` - that is RTK's own error shape, not `action.payload`. These are different and easy to confuse. If you try to read `action.payload` in the rejected case you will get `undefined`.



## What changed in the component

`useSelector` now pulls all three fields at once:

```js
const { joke, loading, error } = useSelector(state => state.joke)
```

The UI renders a different thing depending on which flag is active. Only one should be true at any moment - `pending` sets `loading` to true and clears `error`, so you will never see both a spinner and an error message at the same time. The slice enforces that guarantee.

The button is disabled while `loading` is true so a second request cannot be fired while one is already in flight.



## The full picture

Adding loading and error handling required:

- two new fields in `initialState`
- two new cases in `extraReducers`
- conditional rendering in the component

The thunk itself did not change at all. The async function is still just a fetch that returns a joke string. The lifecycle actions RTK generates handled the rest - you just told the slice what to do when each one fired.