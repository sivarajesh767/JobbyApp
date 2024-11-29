import {Component} from 'react'
import {Loader} from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsFillBriefcaseFill, BsStarFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'
import {MdLocationOn} from 'react-icons/md'

import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'
import SkillsCard from '../SkillsCard'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class JobItemDetails extends Component {
  state = {
    jobData: {},
    similarJobsData: [],
    apiStatus: apiStatusConstants.initial,
  }
  componentDidmount() {
    this.getJobData()
  }

  getFormattedSimilarData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    rating: data.rating,
    title: data.title,
  })

  getFormattedData = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    lifeAtCompany: {
      description: data.life_at_company.description,
      imageUrl: data.life_at_company.image_url,
    },
    location: data.location,
    title: data.title,
    rating: data.rating,
    packagePerAnnum: data.package_per_annum,
    skills: data.skills.map(eachSkills => ({
      imageUrl: eachSkills.image_url,
      name: eachSkills.name,
    })),
  })
  getJobData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = ` https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updatedData = this.getFormattedData(data.job_details)
      const updatedSimilarJobsData = data.similar_jobs.map(eachSimilarJob =>
        this.getFormattedSimilarData(eachSimilarJob),
      )
      console.log(updatedData)
      console.log(updatedSimilarJobsData)
      this.setState({
        jobData: updatedData,
        similarJobsData: updatedSimilarJobsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderFailureView = () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    return (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannt seem to find the page you are looking for</p>
        <button id="button" type="button" onClick={this.getJobData}>
          Retry
        </button>
      </div>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffff" height="50" width="50" />
    </div>
  )
  renderJobDetailsView = () => {
    const {jobData, similarJobsData} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      title,
      packagePerAnnum,
      rating,
      lifeAtCompany,
      skills,
    } = jobData
    const {description, imageUrl} = lifeAtCompany
    return (
      <div>
        <div>
          <div>
            <div>
              <img src={companyLogoUrl} alt="job details company logo" />
            </div>
            <h1>{title}</h1>
            <div>
              <BsStarFill />
              <p>{rating}</p>
            </div>
          </div>
        </div>

        <div>
          <div>
            <div>
              <MdLocationOn />
              <p>{location}</p>
            </div>
            <div>
              <BsFillBriefcaseFill />
              <p>{employmentType}</p>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr />

          <div>
            <h1>Description</h1>
            <div>
              <a href={companyWebsiteUrl}>Visit</a>
              <BiLinkExternal />
            </div>
          </div>

          <p>{jobDescription}</p>
          <h1>Skills</h1>
          <ul>
            {skills.map(eachSkills => (
              <SkillsCard skillDetails={eachSkills} key={eachSkills.name} />
            ))}
          </ul>

          <h1>Life at Company</h1>
          <div>
            <p>{description}</p>
            <img src={imageUrl} alt="life at company" />
          </div>
        </div>
        <h1>Similar Jobs</h1>
        <ul>
          {similarJobsData.map(eachSimilarJob => (
            <SimilarJobItem
              key={eachSimilarJob.id}
              jobDetails={eachSimilarJob}
            />
          ))}
        </ul>
      </div>
    )
  }
  renderJobDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
  render() {
    return (
      <>
        <Header />
        <div>{this.renderJobDetails()}</div>
      </>
    )
  }
}
export default JobItemDetails
