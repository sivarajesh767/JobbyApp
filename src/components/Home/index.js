import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = props => (
  <>
    <Header />
    <div>
      <div>
        <h1>Find the Job That Fits Your Life</h1>
        <p>Millions of people search for jobs,</p>
        <Link to="/jobs">
          <button type="button">Find Jobs</button>
        </Link>
      </div>
    </div>
  </>
)
export default Home
