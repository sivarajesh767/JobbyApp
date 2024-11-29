import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookies'
import {AiOutlineSearch} from 'react-icons/ai'
import Header from '../Header'
import JobItem from '../JobItem'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
const apiJobsStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
const failureViewImage =
  'https://assets.ccbp.in/frontend/react-js/failure-img.png'

class AllJobs extends Component {
  state = {
    profileDate: [],
    jobsData: [],
    checkboxInputs: [],
    radioInput: '',
    searchInput: '',
    apiStatus: apiStatusConstants.initial,
    apiJobsStatus: apiJobsStatusConstants.initial,
  }
  componentDidMount() {
    this.onGetProfileDetails()
    this.onGetJobDetails()
  }
  onGetJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {checkboxInputs, radioInput, searchInput} = this.state
    const profileApiUrl = 'https://apis.ccbp.in/jobs'
    const optionsProfile = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const responseProfile = await fetch(profileApiUrl, optionsProfile)
    if (responseProfile.ok === true) {
      const fetchedDataProfile = [await responseProfile.json()]
      const updatedDataProfile = fetchedDataProfile.map(eachItem => ({
        name: eachItem.profile_details.name,
        profileImageUrl: eachItem.profile_details.profile_image_url,
        shortBio: eachItem.profile_details.short_bio,
      }))
      this.setState({
        profileDate: updatedDataProfile,
        responseSuccess: true,
        apiStatus: apiStatusConstants.failure,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }
  onGetRadioOption = event => {
    this.setState({radioInput: event.target.id}, this.onGetJobDetails)
  }

  onGetInputOption = event => {
    const {checkboxInputs} = this.state
    const inputNotInList = checkboxInputs.filter(
      eachItem => eachItem === event.target.id,
    )
    if (inputNotInList.length === 0) {
      this.setState(
        preState => ({
          checkboxInputs: [...preState.checkboxInputs, event.target.id],
        }),
        this.onGetInputOption,
      )
    } else {
      const filteredData = checkboxInputs.filter(
        eachItem => eachItem !== event.target.id,
      )
      this.setState(
        preState => ({checkboxInputs: filteredData}),
        this.onGetJobDetails,
      )
    }
  }
  onGetProfileView = () => {
    const {profileDate, responseSuccess} = this.state
    if (responseSuccess) {
      const {name, profileImageUrl, shortBio} = profileDate[0]
      return (
        <div>
          <img src={profileImageUrl} alt="profile" />
          <h1>{name}</h1>
          <p>{shortBio}</p>
        </div>
      )
    }
    return null
  }

  onRetryProfile = () => {
    this.onGetProfileDetails()
  }

  onGetProfileFailureView = () => (
    <div>
      <button type="button" onClick={this.onRetryProfile}>
        retry
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" height="50" width="50" />
    </div>
  )
  onRenderProfileStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.onGetProfileView()
      case apiStatusConstants.failure:
        return this.onGetProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }
  onRetryJobs = () => {
    this.onGetJobDetails()
  }

  onGetJobsFailureView = () => (
    <div>
      <img src={failureViewImage} alt="failure view" />
      <h1>Oops! Something Went Wrong</h1>
      <p>we cannot seem to find the page you are looking for </p>
      <div>
      <button type="button" onClick={this.onRetryJobs}>retry</button>
      </div>
    </div>
  )

  onGetJobsView=()=>{
    const {jobsData}=this.state
    const noJobs=jobsData.length===0
    return noJobs?(
      <div>
      <img src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png" alt="no jobs"/>
      <h1>No jobs found</h1>
      <p>we could not find any jobs. Try other filters</p>
      </div>
    ):(
      <ul>
      {jobsData.map(eachItem=>(
        <JobItem  key={eachItem.id} jobData={eachItem}/>

      ))}
      </ul>
    )
  }


 onRenderJobStatus=()=>{
  const {apiJobsStatus}=this.state
  switch (apiJobsStatus){
    case apiJobsStatusConstants.success:
    return this.onGetJobsView()
    case apiJobsStatusConstants.failure:
    return this.onGetJobsFailureView()
    case apiJobsStatusConstants.inProgress:
    return this.renderLoaderView()
    default : return null
  }

 }
 onGetCheckBoxsView=()=>{
  <ul>
  {employmentTypesList.map(eachItem=>(

    <li key={eachItem.employmentTypeId}>
    <input type="checkbox" id={eachItem.employmentTypeId} onChange={this.onGetInputOption}/>
    <label htmlFor={eachItem.employmentTypeId}>{eachItem.label}</label>
    </li>
  ))}
  
  </ul>
 }





 onGetRadioButtonsView=()=>{
  <ul>
  {salaryRangesList.map(eachItem=>(
    <li key={eachItem.salaryRangeId}>
    <input type="radio" name="option" onChange={this.onGetRadioOption} id={eachItem.salaryRangeId}/>
    <label htmlFor={eachItem.salaryRangeId}>{eachItem.label}</label>
    </li>
  ))}
  
  
  </ul>

 }


 onGetSearchInput=event=>{
  this.setState({searchInput:event.target.value})
 }
 onSubmitSearchInput=()=>{
  this.onGetJobDetails()
 }
 onEnterSearchInput=event=>{
    if (event.key==='Enter'){
         this.onGetJobDetails()
    }
 }
 render(){
  const {searchInput, radioInput, checkboxInputs}=this.state
  return (
    <>
    <Header/>
    <div className="slide-bar-container">
    {this.onRenderProfileStatus()}
    <hr/>
    <h1>Type of Employment</h1>
    {this.onGetCheckBoxsView()}
    <hr/>
    <h1>Salary Range</h1>
    {this.onGetRadioButtonsView()}
      </div>
    <div>
    <div>
    <input type="search" value={searchInput} placeholder="search" onChange={this.onGetSearchInput} onKeyDown={this.onEnterSearchInput}/>
    <button data-testid="searchButton" type="button" onClick={this.onSubmitSearchInput}>
    <AiOutlineSearch />
    </button>
    </div>
    {this.onRenderJobStatus()}
    </div>
    </>
  )
 }

}
export default AllJobs
