import React from 'react'
import { useState, useEffect } from 'react'
import Map, { Marker } from 'react-map-gl'
import api from '../../api/contactAPI'
import ContactForm from '../Modal/ContactForm'



const MapB = () => {

  const [items, setItems] = useState([]);
/*
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
  }, []);
*/
  const [contact, setContact] = useState('');
  const [toggleForm, setToggleForm] = useState(false);

  const handleToggleForm = (param) => {
    setContact(param);
    setToggleForm(!toggleForm);
  }


  return (

    <div className='h-full w-3/4 float-left flex' style={{ maxHeight: 'calc(100vh - 65px)'}} >
      <div className='h-[95%] w-[95%] m-auto cursor-grab overflow-auto'>
        <Map
          mapboxAccessToken='pk.eyJ1IjoieXZlc3RhbiIsImEiOiJjbGRwczllamkxNjg1M3F0NmpmeW1zMHhhIn0.LpkG5sF33tcYKwZ4cbuEwg'
          initialViewState={{
            longitude: '6.019018007537025',
            latitude: '47.240500749279',
            zoom: '14'
          }}
          mapStyle='mapbox://styles/mapbox/streets-v11'
          attributionControl=''
          
        >
          {
            items.map((data, index) => {
              return (
                  
                  data.position ? (
                    
                    <Marker 
                      key={index}
                      longitude={data.position.long}
                      latitude={data.position.lat}
                      onClick={()=>{handleToggleForm(data)}}
                    />
                  ) : ""
                
              )

            })
          }
          
          

        </Map>
      </div>
      {
      toggleForm ? <ContactForm 
                  HandleToggleForm = {handleToggleForm}
                  Items = {contact}
                  /> 
                  : ""
      }
    </div>
    
  )
}

export default MapB
