import UsersPage from '../pages/users'
import useUserStore from '../entities/user/useUserStore'
import MyFormModal from '../features/user-form';
function App() {
  const { addFormVisible, showAddForm} = useUserStore();
  return (
    
    <div className="App">
       <button
        className="btn btn-primary"
        onClick={showAddForm} // <-- Call the action
        style={{ marginBottom: '20px' }}
      >
        Add User
      </button>
      <MyFormModal />
      {!addFormVisible && <UsersPage />}
    </div>
  )
}

export default App
