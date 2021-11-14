import {Component} from 'react'
import {
  AiOutlineLeft,
  AiOutlineDoubleRight,
  AiOutlineDoubleLeft,
  AiOutlineRight,
} from 'react-icons/ai'
import PersonType from './components/PersonType'
import Pagination from './components/Pagination'
import './App.css'

class App extends Component {
  state = {
    searchElement: '',
    activePage: 1,
    mailData: [],
    totalList: [],
    searchedList: [],
    isChecked: false,
    editItemDetails: [],
  }

  componentDidMount() {
    this.getDataFromApi()
  }

  getDataFromApi = async () => {
    const {isChecked} = this.state
    const url = `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    const fetchedData = await response.json()
    const limit = 10
    const totalPages = Math.ceil(fetchedData.length / limit)
    const totalItems = []
    for (let index = 1; index < totalPages + 1; index += 1) {
      totalItems.push(index)
    }
    const fetchedDataWithCheck = fetchedData.map(eachData => ({
      id: eachData.id,
      name: eachData.name,
      email: eachData.email,
      role: eachData.role,
      isChecked,
    }))
    this.setState({mailData: fetchedDataWithCheck, totalList: totalItems})
  }

  searchItem = event => {
    const {mailData} = this.state
    const filteredData = mailData.filter(
      each =>
        each.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
        each.email.toLowerCase().includes(event.target.value.toLowerCase()) ||
        each.role.toLowerCase().includes(event.target.value.toLowerCase()),
    )
    const limit = 10
    const filteredPages = Math.ceil(filteredData.length / limit)
    const filteredList = []
    for (let index = 1; index < filteredPages + 1; index += 1) {
      filteredList.push(index)
    }
    this.setState({
      searchElement: event.target.value,
      totalList: filteredList,
      searchedList: filteredData,
    })
  }

  onChangePage = id => {
    this.setState({activePage: id})
  }

  goToFirstPage = () => {
    this.setState({activePage: 1})
  }

  goToLastPage = () => {
    const {mailData, searchedList, searchElement} = this.state
    const pageNumber =
      searchElement.length === 0
        ? Math.ceil(mailData.length / 10)
        : Math.ceil(searchedList.length / 10)
    this.setState({activePage: pageNumber})
  }

  goToNextPage = () => {
    const {activePage, mailData, searchedList, searchElement} = this.state
    const pageNumber =
      searchElement.length === 0
        ? Math.ceil(mailData.length / 10)
        : Math.ceil(searchedList.length / 10)
    if (pageNumber > activePage) {
      this.setState(prevState => ({activePage: prevState.activePage + 1}))
    }
  }

  goToPreviousPage = () => {
    const {activePage} = this.state
    if (activePage > 1) {
      this.setState(prevState => ({activePage: prevState.activePage - 1}))
    }
  }

  onClickDelete = id => {
    const {mailData} = this.state
    const updatedList = mailData.filter(eachItem => eachItem.id !== id)
    this.setState({mailData: updatedList, searchedList: updatedList})
  }

  changeSelectAllCheckBox = () => {
    this.setState(
      prevState => ({isChecked: !prevState.isChecked}),
      this.getDataFromApi,
    )
  }

  onCheckSelect = id => {
    this.setState(prevState => ({
      mailData: prevState.mailData.map(eachDataItem => {
        if (id === eachDataItem.id) {
          return {...eachDataItem, isChecked: !eachDataItem.isChecked}
        }
        return eachDataItem
      }),
    }))
  }

  deleteSelectedItems = () => {
    const {mailData, searchElement, searchedList} = this.state
    console.log(mailData)
    const deleteToBeList =
      searchElement.length === 0
        ? mailData.filter(eachMail => !eachMail.isChecked)
        : searchedList.filter(eachMail => !eachMail.isChecked)
    console.log(deleteToBeList)

    this.setState({mailData: deleteToBeList})
  }

  render() {
    const {
      searchElement,
      searchedList,
      activePage,
      totalList,
      mailData,
      selectAll,
    } = this.state
    const activeList = searchElement.length === 0 ? mailData : searchedList
    const pageNumber = Math.ceil(activeList.length / 10)
    const limit = 10
    const offset = (activePage - 1) * limit
    const dataToShow = activeList.slice(offset, offset + limit)
    const disabledPreviousButtons =
      activePage === 1 ? 'disabled-button' : 'button-item'
    const disabledNextButtons =
      activePage === pageNumber ? 'disabled-button' : 'button-item'
    console.log(dataToShow)

    return (
      <div className="app-container">
        <div className="app-details">
          <input
            type="search"
            placeholder="Search by name, email or role"
            value={searchElement}
            onChange={this.searchItem}
            className="input-field"
          />
          <div className="heading-container">
            <input type="checkbox" onChange={this.changeSelectAllCheckBox} />
            <p className="heading">Name</p>
            <p className="heading">Email</p>
            <p className="heading">Role</p>
            <p className="heading">Actions</p>
          </div>
          <hr />
          {dataToShow.map(eachPerson => (
            <PersonType
              key={eachPerson.id}
              personDetails={eachPerson}
              onClickDelete={this.onClickDelete}
              onClickEdit={this.onClickEdit}
              selectAll={selectAll}
              deleteSelectedItems={this.deleteSelectedItems}
              onCheckSelect={this.onCheckSelect}
              mailData={mailData}
            />
          ))}
          <div className="pagination-container">
            <button
              type="button"
              onClick={this.deleteSelectedItems}
              className="delete-selected-button"
            >
              Delete Selected
            </button>
            <div className="buttons-container">
              <button
                type="button"
                onClick={this.goToFirstPage}
                className={disabledPreviousButtons}
              >
                <AiOutlineDoubleLeft />
              </button>
              <button
                type="button"
                onClick={this.goToPreviousPage}
                className={disabledPreviousButtons}
              >
                <AiOutlineLeft className="previous" />
              </button>
              {totalList.map(eachPage => (
                <Pagination
                  key={eachPage}
                  details={eachPage}
                  onChangePage={this.onChangePage}
                  isActive={activePage === eachPage}
                />
              ))}
              <button
                type="button"
                onClick={this.goToNextPage}
                className={disabledNextButtons}
              >
                <AiOutlineRight />
              </button>
              <button
                type="button"
                onClick={this.goToLastPage}
                className={disabledNextButtons}
              >
                <AiOutlineDoubleRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default App
