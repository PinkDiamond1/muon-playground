import React, { useState, useEffect } from 'react'
import './Popup.css'
import SaveRequestPopup from '../SaveRequestPopup/SaveRequestPopup'
import {useOutSideClick} from '../../hooks/useOutSideClick'

const Popup = (props) => {
  const {visible, setVisible, ref} = useOutSideClick(false)
  const [uniqueName, setUniqueName]  = useState()
  const [newData, setNewData] = useState('')
  const [isCopied, setIsCopied] = useState(false);

  async function copyTextToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      // navigator clipboard api method'
      return navigator.clipboard.writeText(text);
  } else {
      // text area method
      let textArea = document.createElement("textarea");
      textArea.value = text;
      // make the textarea out of viewport
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise((res, rej) => {
          // here the magic happens
          document.execCommand('copy') ? res() : rej();
          textArea.remove();
      });
  }
  }

  const handleCopyClick = () => {
    copyTextToClipboard(newData)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    setUniqueName(props.uniqueName)
  }, [props.uniqueName])

  const handelClose = () => {
    setVisible(false)
  }

  return ( 
    <div ref={ref} id="popup-main">
      <div id='saveRequest'>
        <button onClick={() => setVisible(!visible)}>Save Request</button>
      </div>
      {
      visible ? 
      <div id='popup'>
        <div id='container'>
          <p>Save the Request</p>
          <div id="savBtn-section">
            <p>Enter a unique slug and save your request.</p>
            <div id='close-btn'>
              <button onClick={handelClose}>X</button>
            </div>
            <div id='form-group'>
              <input 
                  type="text"
                  placeholder="Enter a unique slug"
                  value={uniqueName ?? ''}
                  onChange={e => setUniqueName(e.target.value)}
              />
              <SaveRequestPopup requestData={(newData) => setNewData(newData) }  apiData={props.apiData} apiUrl={props.apiUrl} uniqueName={uniqueName} method={props.method}/>
            </div>
          </div>
          <div id='newLink' className='input-style'>
            <input 
              placeholder="Your link"
              readOnly
              value={newData ?? ''}
            />
            {newData !== '' ? <button onClick={handleCopyClick}>
            <span>{isCopied ? 'Copied!' : 'Copy'}</span>
            </button> : ''}
          </div>
          <div>
            {props.children}
          </div>
        </div>
      </div>
    : ""
    }
    </div>
  )
}

export default Popup
