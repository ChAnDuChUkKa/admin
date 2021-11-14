import {FiEdit} from 'react-icons/fi'
import {AiOutlineDelete} from 'react-icons/ai'
import './index.css'

const PersonType = props => {
  const {personDetails, onClickDelete, onClickEdit, onCheckSelect} = props
  const {name, email, role, id, isChecked} = personDetails
  const activeSelect = isChecked ? 'active-check-box' : 'check-box'

  const deleteItem = () => {
    onClickDelete(id)
  }

  const changeSelectItem = () => {
    onCheckSelect(id)
  }

  const editItem = () => {
    onClickEdit(id)
  }

  return (
    <>
      <div className={`person-details ${activeSelect}`}>
        <input
          type="checkbox"
          onClick={changeSelectItem}
          value={name}
          id={id}
          name="multiple-select"
        />
        <p className="detail-of-person">{name}</p>
        <p className="detail-of-person">{email}</p>
        <p className="detail-of-person">{role}</p>
        <div className="action-container">
          <button type="button" onClick={editItem}>
            <FiEdit className="edit-icon" />
          </button>
          <button type="button" onClick={deleteItem}>
            <AiOutlineDelete className="delete-icon" />
          </button>
        </div>
      </div>
      <hr />
    </>
  )
}

export default PersonType
