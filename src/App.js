import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './App.css'

// This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

// Replace your code here
const apiStatusConstants = {
  initial: 'INITIAL',
  progress: 'PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class App extends Component {
  state = {
    category: categoriesList[0].displayText,
    apiStatus: apiStatusConstants.initial,
    projectsArray: [],
  }

  optionSelected = event => {
    this.setState({category: event.target.value}, this.fetchDetails)
    console.log(event.target.value)
  }

  componentDidMount = () => {
    this.fetchDetails()
  }

  loaderFunction = () => (
    <div data-testid="loader">
      <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
    </div>
  )

  fetchDetails = async () => {
    const {category} = this.state
    this.setState({apiStatus: apiStatusConstants.progress})
    console.log(category)
    const filterList = categoriesList.filter(
      eachList => eachList.displayText === category,
    )
    console.log(filterList)
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${filterList[0].id}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl)
    // console.log(response)
    if (response.ok === true) {
      const jsonData = await response.json()
      console.log(jsonData)
      this.setState({
        projectsArray: jsonData.projects,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 401) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  successView = () => {
    const {projectsArray} = this.state
    return (
      <>
        <ul className="css-ul-successview-container">
          {projectsArray.map(eachCourse => (
            <li key={eachCourse.id}>
              <div className="css-list-container">
                <img src={eachCourse.image_url} alt={eachCourse.name} />
                <p>{eachCourse.name}</p>
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  }

  failureView = () => (
    <div className="css-failureview-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        type="button"
        className="css-retry-button"
        onClick={this.fetchDetails}
      >
        Retry
      </button>
    </div>
  )

  displayFunction = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.progress:
        return this.loaderFunction()
      case apiStatusConstants.success:
        return this.successView()
      case apiStatusConstants.failure:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    const {category} = this.state
    return (
      <div className="css-bg-container">
        <div className="css-navbar-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="css-websitelogo-itself"
          />
        </div>
        <div className="css-projects-display-container">
          <select
            className="css-select-container"
            value={category}
            onChange={this.optionSelected}
          >
            {categoriesList.map(eachList => (
              <option key={eachList.id}>{eachList.displayText}</option>
            ))}
          </select>
          {this.displayFunction()}
        </div>
      </div>
    )
  }
}

export default App
