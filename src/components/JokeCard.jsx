import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchJoke } from '../store/jokeSlice'

export default function JokeCard() {
  const joke = useSelector(state => state.joke.joke)
  const dispatch = useDispatch()

  // fetch a joke when the component mounts
  // same dispatch pattern as before - the difference is that fetchJoke
  // is a thunk, not a plain action creator. dispatch handles both the same way.
  // RTK takes care of the async work before anything reaches the store.
  useEffect(() => {
    dispatch(fetchJoke())
  }, [])

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow-sm">
          <div className="card-body text-center p-5">
            <div className="fs-1 mb-3">😄</div>
            <p className="fs-5 mb-4">
              {joke ?? 'Loading...'}
            </p>
            <button
              className="btn btn-dark"
              onClick={() => dispatch(fetchJoke())}
            >
              Get another joke
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}