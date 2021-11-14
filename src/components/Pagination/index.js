import './index.css'

const Pagination = props => {
  const {details, onChangePage, isActive} = props
  const activeClass = isActive ? 'active-button' : 'button-item'

  const changePageNumber = () => {
    onChangePage(details)
  }

  return (
    <button type="button" onClick={changePageNumber} className={activeClass}>
      {details}
    </button>
  )
}

export default Pagination
