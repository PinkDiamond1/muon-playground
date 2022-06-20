import React from 'react'
import axios from 'axios'
import './SaveRequestPopup.css'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const SaveRequestPopup = (props) => {
    const MySwal = withReactContent(Swal)
    const {apiData, apiUrl, uniqueName, method} = (props)
    console.log(apiData)
    let New_apiData;

    const handelSaveRequest = async () => {
        console.log(props)
        if (await checkUniqueName() === false) { 
          return MySwal.fire({
            title: <p>Invalid Slug</p>,
            icon:"error",
            timer: 1700,
            showCancelButton: false,
            showConfirmButton: false
          }) 
        }

        if (await checkUniqueName() !== null) { 
          return MySwal.fire({
            title: <p>Duplicate Slug</p>,
            icon:"error",
            timer: 1700,
            showCancelButton: false,
            showConfirmButton: false
          }) 
        }

        if (apiUrl.trim().length === 0 ) {
          return MySwal.fire({
            title: <p>Please enter api url.</p>,
            icon:"error",
            timer: 1700,
            showCancelButton: false,
            showConfirmButton: false
          }) 
        }

        try {
          new URL(apiUrl);
        } catch (_) {
          return MySwal.fire({
            title: <p>Bad url.</p>,
            icon:"error",
            timer: 1700,
            showCancelButton: false,
            showConfirmButton: false
          })   
        }

        if (apiData === undefined) {
          New_apiData = {}
        }
        else{
          New_apiData = apiData
        }

        let data = {
          name: uniqueName,
          url: apiUrl,
          method: method,
          data: New_apiData,
          slug: uniqueName
        }

        console.log(data)

        axios.post('https://playground-api.muon.net/store', data).then((response) => {
          props.requestData(`https://playground.muon.net/${uniqueName}`)
          return MySwal.fire({
            title: <p>Request Saved</p>,
            icon:"success",
            timer: 1700,
            showCancelButton: false,
            showConfirmButton: false
          })
        })
      }

    const checkUniqueName = async () => {
      let letterNumber = /^[0-9a-zA-Z_-]+$/
      let stringValidator = uniqueName.match(letterNumber) ? true : false
      if(stringValidator === false) { return false }
      let data = {name: uniqueName}
      const res = await axios.post('https://playground-api.muon.net/getDataByName', data).then((response) => {
        return(response.data.response)
      })
      return res
    }

  return (
    <div id='popup-btn'>
       <button id="saveBtn" onClick={handelSaveRequest}>Save</button>
    </div>
  )
}

export default SaveRequestPopup
