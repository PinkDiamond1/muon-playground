import React from 'react'
import logo from '../../assets/images/logo.svg'
import muonNetWork from '../../assets/images/muonNetworkBlack.svg'
import './Footer.css'
const Footer = () => {
  return (
        <div id="footer">
            <div id='powered-by'>Powered by</div>
            <img alt="Muon logo" src = {logo} />
            <img alt="muonNetwork" src = {muonNetWork} />
        </div>
  )
}

export default Footer
