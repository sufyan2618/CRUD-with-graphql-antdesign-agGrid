import UsersPage from '../pages/users'
import useUserStore from '../entities/user/useUserStore'
import MyFormModal from '../features/user-form';
import { Toaster } from 'react-hot-toast';
import '../App.css';
function App() {
  const { addFormVisible, showAddForm} = useUserStore();
  return (
    <> 
    <div className="bg-gray-900 p-4 ">
      <div className="flex justify-center items-center mb-4">
   
      <h1 className="text-2xl text-center text-white ">User Management</h1>
      </div>
  
      {!addFormVisible && <UsersPage />}
      <MyFormModal />
    </div>
   
  
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        className: '',
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
        },
      }}
    />
    </>
  )
}

export default App
