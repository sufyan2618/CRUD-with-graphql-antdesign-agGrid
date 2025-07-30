import UsersPage from '../pages/users'
import useUserStore from '../entities/user/useUserStore'
import MyFormModal from '../features/user-form';
import { Toaster } from 'react-hot-toast';
import '../App.css';
function App() {
  const { addFormVisible} = useUserStore();
  return (
    <> 
  
      <UsersPage />
      <MyFormModal />
  
   
  
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
