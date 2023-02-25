import './App.css';
import MapB from "./components/Layout/MapB"
import Contacts from "./components/Layout/Contacts"


function App() {
  return (
    
    <div className='h-screen'>
      <header className='flex h-[65px]'>
        <div className=' text-white text-[45px] font-serif font-bold flex items-center justify-center bg-blue-500 w-[50px] h-[65px] ml-[20px]'>H</div>
        <h2 className='text-blue-600 font-medium mt-auto mb-auto ml-[10px]' >Mes contacts</h2>
      </header>
      <MapB />
      <Contacts />
    </div>
    


  )
  
}

export default App;
