# Redux Toolkit Intro - Async Thunk Demo

## What this app does

It fetches a dad joke from a public API and displays it on screen. There is a button to fetch another one.

That is it. The app exists to show one thing: how Redux Toolkit handles asynchronous operations. The joke is just something to look at.



## Before anything else - what is a thunk

Every state change in Redux follows the same rule: dispatch an action, the reducer handles it, state updates. That works perfectly when everything is synchronous.

Fetching data is not synchronous. You fire a request, wait for a response, then decide what to do with the result. A plain action object cannot do that - it is just data. It has no concept of waiting.

A thunk solves this by changing what you dispatch. Instead of an object, you dispatch a function. That function receives `dispatch` as an argument, does its async work, and then dispatches a plain action when it is ready.

The word "thunk" just means a function that wraps some work to be done later. That is the entire idea.

In bare Redux you had to write this yourself:

```js
// a thunk written by hand
const fetchJoke = () => async (dispatch) => {
  const response = await fetch('https://icanhazdadjoke.com/', {
    headers: { Accept: 'application/json' }
  })
  const data = await response.json()
  dispatch({ type: 'joke/setJoke', payload: data.joke })
}
```

You dispatch a function. That function does the async work. When it finishes it dispatches the real action. Redux middleware intercepts the function, sees it is not a plain object, and runs it instead of sending it to the reducer.

RTK does not change this pattern. It generates the ceremony around it.



## What createAsyncThunk does

`createAsyncThunk` takes two arguments: a name for the action, and the async function that does the work.

```js
export const fetchJoke = createAsyncThunk('joke/fetchJoke', async () => {
  const response = await fetch('https://icanhazdadjoke.com/', {
    headers: { Accept: 'application/json' }
  })
  const data = await response.json()
  return data.joke
})
```

Whatever the async function returns becomes `action.payload` when the request completes. That return value is the only bridge between the async world and the store.

RTK also generates three lifecycle action types automatically from the name you gave it:

| Type | When it fires |
|||
| `joke/fetchJoke/pending` | The moment dispatch is called, before the fetch begins |
| `joke/fetchJoke/fulfilled` | The fetch completed and returned a result |
| `joke/fetchJoke/rejected` | The fetch failed or threw an error |

This demo only handles `fulfilled` - the happy path. The pending and rejected cases are real and important, and they are the focus of the next branch.



## Why extraReducers and not reducers

The slice has two sections for handling actions: `reducers` and `extraReducers`.

`reducers` is for actions that belong to this slice - actions that `createSlice` generates for you.

`extraReducers` is for actions that were defined outside the slice. The thunk lives above the slice definition, not inside it - so the slice responds to it here:

```js
extraReducers: (builder) => {
  builder.addCase(fetchJoke.fulfilled, (state, action) => {
    state.joke = action.payload
  })
}
```

`fetchJoke.fulfilled` is the action type RTK generated. When that action fires, this case runs and `action.payload` is the joke string that the thunk returned.

This is the full journey of a state change with async involved:

1. Component calls `dispatch(fetchJoke())`
2. RTK dispatches `joke/fetchJoke/pending` - the request is starting
3. The async function runs - the fetch goes out, the response comes back
4. RTK dispatches `joke/fetchJoke/fulfilled` with `payload: data.joke`
5. `extraReducers` catches `fulfilled`, sets `state.joke`
6. `JokeCard` is subscribed via `useSelector` - it re-renders with the new joke



## What the component does

From the component's perspective almost nothing has changed:

```js
const dispatch = useDispatch()

dispatch(fetchJoke())
```

This looks identical to dispatching a plain action. The component does not know or care that `fetchJoke` is async. The thunk handles everything out of sight - the component just fires and forgets.

`useEffect` with an empty dependency array fires once on mount, so there is always a joke visible when the page loads. The button dispatches the same thunk again to fetch a new one.

## Reference

- Repo from class: https://github.com/NicholasLennox/redux-toolkit-intro
- RTK docs: https://redux-toolkit.js.org/api/createAsyncThunk