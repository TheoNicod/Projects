import React from 'react'
import { useState, useEffect } from 'react'
import api from '../../api/contactAPI'
import AddContact from '../Modal/AddContact'
import ContactForm from '../Modal/ContactForm'

const Contacts = () => {

  const [items, setItems] = useState([]);
  const [contact, setContact] = useState('');
  const [toggleForm, setToggleForm] = useState(false);

  const handleToggleForm = (param) => {
    setContact(param);
    setToggleForm(!toggleForm);
  }

  const [toggleAdd, setToggleAdd] = useState(false);

  const handleToggleAdd = () => {
    setToggleAdd(!toggleAdd);
  }



  useEffect (() => {
    const fetchContacts = async () => {
      try {
        const response = await api.get('./contact');
        setItems(response.data);
      } catch (err) {
        //console.log(err.response.message);
      }
    }
    fetchContacts();
  }, [toggleAdd]);

  return (
    <>
    <div className='h-full w-1/4 float-right' style={{ maxHeight: 'calc(100vh - 65px)' }}>
      <div className='border-black border-solid border-2 w-[20vw] h-[40px] mr-auto ml-auto mt-[2em] flex items-center justify-center'>
        <h2 className=''>Contacts</h2>
      </div>
      <ul className='border-black border-solid border-2 w-[20vw] mr-auto ml-auto'>
        {items
          .map((data, index) => {
            return (
              <li key={index} onClick={()=>{handleToggleForm(data)}} className='mt-[5px] mb-[5px] ml-[10px] hover:cursor-pointer'>
                {data.name}
              </li>
            )

          })}
      </ul>

      <input type="button" value='Ajouter' onClick={handleToggleAdd} className='text-white block ml-auto mr-auto w-[10vw] h-[40px] bg-blue-500 rounded mt-[15px] hover:bg-blue-400 cursor-pointer' />

    </div>
    {
      toggleForm ? <ContactForm 
                  HandleToggleForm = {handleToggleForm}
                  Items = {contact}
                  /> 
                  : ""
    }
    {
      toggleAdd ? <AddContact 
                  HandleToggleAdd = {handleToggleAdd}
                  /> : ""
    }
    
    </>
  )
}

export default Contacts
