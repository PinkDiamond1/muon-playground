import React from 'react'
import styled from 'styled-components'

import logos from '../../assets/images/logo.svg'
import muonNetwork from '../../assets/images/muonNetwork.svg'

const Image = styled.img`
  margin: 0px 3px;
`
const MuonNetwork = (props) => {
  return (
    <>
      <Image src={logos} alt="Muon Logo" />
      <Image src={muonNetwork} alt="muonNetwork"  width="65px"/>
    </>
  )
}

export default MuonNetwork
