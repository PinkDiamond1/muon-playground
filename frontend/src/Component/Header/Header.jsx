import Popup from '../Popup/Popup'
import './Header.css'
import muonLogo from '../../assets/images/muonLogo.jpg'
import { MuonTools } from 'muon-toolbox';



const Header = (props) => {
  return (
    <div id='header'>
      <div id='header-group'>
        <div>
          <img src={muonLogo} width="200px" alt=''></img>
          <MuonTools  mode={process.env.REACT_APP_MODE} />
        </div>
      </div>
        <Popup apiData={props.apiData} apiUrl={props.apiUrl} uniqueName={props.uniqueName} method={props.method}/>    
    </div>
  )
}

export default Header
