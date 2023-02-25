import React from 'react'
import { ImCross } from 'react-icons/im'

const ContactForm = (props) => {
  return (
    <div className='bg-blue-500 w-[400px] h-[500px] absolute top-[20%] right-[40%] rounded-[10px]'>
      <ImCross onClick={()=>{props.HandleToggleForm()}} className='text-white w-[30px] h-[30px] float-right mt-[10px] mr-[10px] p-[8px] cursor-pointer hover:bg-white hover:text-black hover:rounded-full'></ImCross>
      <h1 className='font-medium text-white text-[25px] text-center mt-[50px]' >{props.Items.name}</h1>
      <p className='text-white italic ml-[20px] mt-[10px]'>{props.Items.type}</p>
      <p className='text-white mt-[20px] ml-[20px] mr-[20px] break-words'>{props.Items.desc}</p>
    </div>
  )
}

export default ContactForm
