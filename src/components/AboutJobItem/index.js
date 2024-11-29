import {Component} from 'react'
import Cookies from 'js-cookie'
import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import {BiLinkExternal} from 'react-icons/bi'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarJobs from '../SimilarJobs'
import './index.css'

const apiStatusConstants={
    initial:'INITIAL',
    success:'SUCCESS',
    failure:'FAILURE',
    inProgress:'IN_PROGRESS'
}

class AboutJobItem extends Component{
    state={jobDataDetails:[], similarJobsData:[], apiStatus:apiStatusConstants.initial}
    
    ComponentDidMount(){
        this.getJobData()
    }
    getJobData=async props=>{
        const {match}=this.props
        const {params}=match
        const {id}=params
        this.setState({
            apiStatus:apiStatusConstants.inProgress
        })
       const jwtToken=Cookies.get('jwt_token')
       const jobDetailsApiUrl=`https://apis.ccbp.in/jobs/${id}`
       const optionsJobData={
        headers:{Authorization:`Bearer ${jwtToken}`}, 
        method:'GET',
       }
       const responseJobData=await fetch (jobDetailsApiUrl, optionsJobData)
       if (responseJobData.ok===true){
        const fetchedJobData=await responseJobData.json()
        const updatedJobDetailsData=[fetchedJobData.job_details].map(
            eachItem=>({
                companyLogoUrl:eachItem.company_logo_url,
                companyWebsiteUrl:eachItem.company_website_url,
                employmentType:eachItem.employment_type,
                id:eachItem.id,
                jobDescription:eachItem.jon_description,
                lifeAtCompany:{
                    description:eachItem.life_at_company.description,
                    imageUrl:eachItem.life_at_company.imageUrl
                },
                location:eachItem.location,
                packagePerAnnum:eachItem.package_per_annum,
                rating:eachItem.rating,
                skills:eachItem.skills.map(eachSkill=>({
                    imageUrl:eachSkill.image_url,
                    name:eachSkill.name
                }))
                , 
                title:eachItem.title }))
        const updatedSimilarJobDetails=fetchedJobData.similar_jobs.map(eachItem=>({
                companyLogoUrl:eachItem.company_logo_url,
                id:eachItem.id,
                jobDescription:eachItem.job_description,
                employmentType:eachItem.employment_type,
                location:eachItem.location,
                rating:eachItem.rating,
                title:eachItem.title,
            })
        )
        
    this.setState({
        jobDataDetails:updatedJobDetailsData,
        similarJobsData:updatedSimilarJobDetails,
        apiStatus:apiStatusConstants.success,
    }) 
  
      }else{
        this.setState({apiStatus:apiStatusConstants.failure})
      }
    }
renderJobDetailsSuccessView=()=>{
    const {jobDataDetails, similarJobsData}=this.state
    if (jobDataDetails.length >= 1){
       const {companyLogoUrl, companyWebsiteUrl, employmentType, id, jobDescription, lifeAtCompany, location, packagePerAnnum, rating, skills, title,}=jobDataDetails[0]
       return (
        <>
        <div>
        <div>
        <div>
        <img src={companyLogoUrl} alt="job details company logo"/>
        <div>
        <h1>{title}</h1>
        <div>
        <AiFillStar />
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
       <p>{employmentType}</p>
       </div>
        </div>
   <div>
   <p>{packagePerAnnum}</p>
   </div>

        </div>

        </div>
        <hr/>
       <div>
       <div>
       <h1>Description</h1>
       <a href={companyWebsiteUrl}>visit <BiLinkExternal /></a>
       </div>
       <p>{jobDescription}</p>
       </div>
<h1>Skills</h1>
<ul>
{skills.map(eachItem=>(

    <li key={eachItem.name}>
    <img src={eachItem.imageUrl} alt={eachItem.name}/>
    <p>{eachItem.name}</p>
    </li>
))}
</ul>
<div>
<div>
<h1>Life at Company</h1>
<p>{lifeAtCompany.description}</p>
</div>
<img src={lifeAtCompany.imageUrl} alt="life at company"/>
</div>
 </div>
 <h1>Similar Jobs</h1>
 <ul>
 {similarJobsData.map(eachItem=>(
    <SimilarJobs key={eachItem.id} similarJobData={eachItem} employmentType={employmentType}/>
 ))}
 
 </ul>
        </>
       )
    }
return null 
}
onRetryJobDetailsAgain=()=>{
    this.getJobData()
}
renderJobFailureView=()=>(
    <div>
    <img src="https://assets.ccbp.in/frontend/react-js/failure-img.png" alt="failure view"/>
    <h1>Oops! Something went wrong</h1>
    <p>we cannt seen to find the page you are looking for.</p>
    <div>
    <button type="button" onClick={this.onRetryJobDetailsAgain}>retry</button>
    </div>
    </div>
)

renderJobLoadingView=()=>(
   <div data-testid="loader">
   <Loader type="ThreeDots" color="#8b69ff" height="50" width="50"/>
   </div>

)
renderJobDetails=()=>{
    const {apiStatus}=this.state
    switch (apiStatus){
        case apiStatusConstants.success:
        return this.renderJobDetailsSuccessView()
        case apiStatusConstants.failure:
        return this.renderJobFailureView()
        case apiStatusConstants.inProgress:
        return this.renderJobLoadingView()
        default : return null
    }
}


render(){
    return (


        <>
        <Header/>

        <div>
        {this.renderJobDetails()}
        </div>
        </>
    )
}
}
export default AboutJobItem