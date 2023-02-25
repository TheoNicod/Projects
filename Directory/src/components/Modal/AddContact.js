import React, { useState } from 'react'
import { ImCross } from 'react-icons/im'
import api from '../../api/contactAPI'






const AddContact = (props) => {

    const [text, setText] = useState('');
    const [textArea, setTextArea] = useState('');
    const [select, setSelect] = useState('Entreprise');
    
    
    const handleSubmit = async () => {
            let newContact = {
                name: text,
                desc: textArea,
                type: select,
            }
            console.log(newContact)
            try {
                await api.post('./contact', newContact);
            } catch(err) {
                console.log(err.message)
            }
    };
   

    return (
        <div className='bg-blue-500 w-[400px] h-[500px] absolute top-[20%] right-[40%] rounded-[10px]'>
            <ImCross onClick={()=>{props.HandleToggleAdd()}} className='text-white w-[30px] h-[30px] float-right mt-[10px] mr-[10px] p-[8px] cursor-pointer hover:bg-white hover:text-black hover:rounded-full '></ImCross>
            <h1 className='font-[600] text-white text-[20px] text-center mt-[40px] mb-[30px]' >Ajouter un contact</h1>
            <form>
                    <input
                        type="text"
                        id="textInput"
                        name="textInput"
                        value={text}
                        placeholder='Nom'
                        onChange={e=>setText(e.target.value)}
                        className='block ml-[auto] mr-[auto] mb-[15px] placeholder: p-[3px] w-[300px] focus: outline-none'
                    />
                    <textarea
                        id="textAreaInput"
                        name="textAreaInput"
                        value={textArea}
                        placeholder='Description'
                        onChange={e=>setTextArea(e.target.value)}
                        maxLength='700'
                        className='block ml-[auto] mr-[auto] mb-[15px] placeholder: p-[3px] h-[200px] w-[300px] focus: outline-none'
                    />
                    <select
                        id="selectInput"
                        name="selectInput"
                        value={select}
                        onChange={e=>setSelect(e.target.value)}
                        className='block ml-[auto] mr-[auto] p-[5px] w-[300px] hover: cursor-pointer'
                    >
                        <option value="Entreprise">Entreprise</option>
                        <option value="Particulier">Particulier</option>
                        <option value="Collectivité">Collectivité</option>
                    </select>
                    <input type="button" value='Enregistrer' onClick={()=>{handleSubmit(); props.HandleToggleAdd();}} className='text-black block ml-auto mr-auto w-[300px] h-[40px] bg-slate-100 rounded mt-[45px] hover:bg-slate-200 cursor-pointer' />
            </form>
        </div>
  )
}

export default AddContact
