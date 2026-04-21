import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchJoke } from '../store/jokeSlice'

export default function JokeCard() {
  const { joke, loading, error } = useSelector(state => state.joke)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchJoke())
  }, [])

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow-sm">
          <div className="card-body text-center p-5">
            <div className="fs-1 mb-3">😄</div>

            {loading && (
              <div className="mb-4">
                <div className="spinner-border text-secondary" role="status" />
              </div>
            )}

            {error && (
              <div className="alert alert-danger mb-4">
                Something went wrong: {error}
              </div>
            )}

            {!loading && !error && (
              <p className="fs-5 mb-4">{joke ?? 'No joke loaded.'}</p>
            )}

            <button
              className="btn btn-dark"
              disabled={loading}
              onClick={() => dispatch(fetchJoke())}
            >
              {loading ? 'Fetching...' : 'Get another joke'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}