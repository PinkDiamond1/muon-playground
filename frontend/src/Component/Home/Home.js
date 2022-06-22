import React from 'react'
import { useParams } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content'
import DbEditor from "../DbEditor/DbEditor";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2'
import axios from 'axios'
import '../../App.css'
import {useLocation} from "react-router-dom";
import { MuonTools } from 'muon-toolbox';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools"
import 'ace-builds/src-noconflict/worker-css';
import "ace-builds/webpack-resolver";
import '../ApiEditor/ApiEditor'
import MuonNetwork from '../common/MuonNetwork'
import styled from 'styled-components'
import { Flex } from 'rebass'
import logos from '../../assets/images/logo.svg'

const Image = styled.img``

const AppInfo = styled(Flex)`
  @font-face {
    font-family: 'Montserrat';
    font-weight:normal;
    src: url(/fonts/montserrat-v18-latin-regular.eot) format('eot'),
      url(/fonts/montserrat-v18-latin-regular.ttf) format('turetype'),
      url(/fonts/montserrat-v18-latin-regular.woff) format('woff');
    font-display: block;
  }
  & > * {
    margin-right: 10px;
  }
  font-family: Montserrat;

  .hide-on-mobile {
    @media (max-width: 576px) {
      display: none;
    }
  }
`


const Media = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  @media (min-width: 767px) {
    display: none;
  }
`
const WrapMuonNetwork = styled.div`
  @media (max-width: 767px) {
    display: none;
  }
`


function Home() {
  const {id} = useParams()
  const MySwal = withReactContent(Swal)
  const [apiData, setApiData] = useState()
  const [jsonData, setJsonData] = useState()
  const [apiUrl, setApiUrl] = useState('')
  const [uniqueName, setUniqueName] = useState('')
  const [method , setMethod] = useState('get')
  const [result, setResult] = useState()
  const [resultHeader, setResultHeader] = useState({})
  const [toggleState, setToggleState] = useState(1);
  const [toggleStateResult, setToggleStateResult] = useState(1)
  const [time, setTime] = useState(0)
  const [statusColor, setStatusColor] = useState({color: '', des: ''})
  const search = useLocation().search;
  const run = new URLSearchParams(search).get('run');
  const toggleTab = (index) => {
    setToggleState(index)
  }

  const toggleTabResult = (index) => {
    setToggleStateResult(index)
  }
  
    
  var interval = null;
  var elapsedTime = null;


  useEffect(() => {
    const fetchData = async() => {
      if (id !== undefined) {
        console.log(id)
        let data = {name: id}
        await axios.post('https://playground-api.muon.net/getDataByName', data)
        .then((response) => {
          console.log(response)   
          setApiUrl(response.data.response.url)
          setUniqueName(response.data.response.name)
          setMethod(response.data.response.method)
          try{
            setApiData(JSON.parse(response.data.response.data))
          }
          catch{
            
          }
          setJsonData(response.data.response.data)
          console.log(response.data.response.url)
          if (Number(run) === 1 && apiUrl.trim().length !== 0) {
            console.log('muon')
            muonize()
          }
        })
        .catch(error => console.log(error))
      }
    }
    fetchData()
  }, [id ,apiUrl, run])

  

  const timer = () => {
    // console.log('timer')
    let startTime = Date.now();
    interval = setInterval(() => {
      elapsedTime = Date.now() - startTime;
      setTime('In Progress: ' + (elapsedTime / 1000).toFixed(3))
    }, 10);
  }

  const muonize = async () => {
    if (apiUrl.trim().length === 0) {
      return MySwal.fire({
        title: <p>Please enter api link!</p>,
        icon:"error",
        timer: 1700,
        showCancelButton: false,
        showConfirmButton: false
      }) 
    }
    timer()
    setToggleStateResult(1)
    let data = {}
    // apiData = store.getState().apiData.apiData
    try{
      data = JSON.parse(jsonData) 
    }
    catch{
      data = {}
    }
    if (method === 'get'){
      await axios.get(apiUrl).then((response) => {
       setResult(response.data)
       setResultHeader(response.headers)
       response.status === 200 ? setStatusColor({...statusColor, ['color']:"green", ["des"]: response.status}) : response.status === 404 ? setStatusColor({...statusColor, ['color']:"red", ["des"]: response.status}) : setStatusColor({...statusColor, ['color']:"#fcfc03", ["des"]: response.status})
       clearInterval(interval)
       setTime('Duration: ' + (elapsedTime / 1000).toFixed(3))

      })
      .catch(error => {
        console.log(error)
        clearInterval(interval)
        error.response.status === 200 ? setStatusColor({...statusColor, ['color']:"green", ["des"]: error.response.status}) : error.response.status === 404 ? setStatusColor({...statusColor, ['color']:"#dc3545", ["des"]: error.response.status}) : setStatusColor({...statusColor, ['color']:"#fcfc03", ["des"]: error.response.status})
        setTime('Duration: ' + (elapsedTime / 1000).toFixed(3))}
      )
    }
    else{
      await axios.post(apiUrl, data).then((response) => {
        setResult(response.data)
        setResultHeader(response.headers)
        setStatusColor(response.status)
        clearInterval(interval)
        setTime('Duration: ' + (elapsedTime / 1000).toFixed(3))
        response.status === 200 ? setStatusColor({...statusColor, ['color']:"green", ["des"]: response.status}) : response.status === 404 ? setStatusColor({...statusColor, ['color']:"red", ["des"]: response.status}) : setStatusColor({...statusColor, ['color']:"#fcfc03", ["des"]: response.status})
      })
      .catch(error => {
        console.log(error)
        clearInterval(interval)
        error.response.status === 200 ? setStatusColor({...statusColor, ['color']:"green", ["des"]: error.response.status}) : error.response.status === 404 ? setStatusColor({...statusColor, ['color']:"#dc3545", ["des"]: error.response.status}) : setStatusColor({...statusColor, ['color']:"#fcfc03", ["des"]: error.response.status})
        setTime('Duration: ' + (elapsedTime / 1000).toFixed(3))
      })
    }
  }

  const onChangeData = (newValue) => {
    setJsonData(newValue)
  }

  return (
    
    <>
      <div className='muonHeader' style={{ fontSize:"12px" ,fontWeight:"normal", padding:"10px", marginLeft:"15px", color:"#313144", fontFamily: "Montserrat"}}>
        <AppInfo>
          <WrapMuonNetwork>
            <MuonNetwork logo="muonNetwork" />
          </WrapMuonNetwork>
          <Media>
            <Image src={logos} alt="logo" />
          </Media>
          <MuonTools  mode={process.env.REACT_APP_MODE}/>
        </AppInfo>
      </div>
      <div className="App" >
      <Header apiData={jsonData} apiUrl={apiUrl} uniqueName={uniqueName} method={method}/>
      <div className="main">
        <div id="muonize-section">
          <select value={method ?? ''} onChange={e => setMethod(e.target.value)}>
            <option value='get'>Get</option>
            <option value='post'>Post</option>
          </select>
          <input 
            placeholder=""
            value={apiUrl ?? ''}
            onChange={e => setApiUrl(e.target.value)}
          />
          <button id="muonize-btn" onClick={muonize}>Muonize</button>
        </div>
        <div id="editor-section">
          <div id="editor-api">
            <div className="tab">
                <button className={toggleState === 1 ? 'active-tabs': 'tab'} onClick={() => toggleTab(1)}>JSON</button>
            </div>
            <div className={toggleState === 1 ? "activeContent" : "tabContent"}>
            <AceEditor
              mode="json"
              onChange={onChangeData}
              name="editor"
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                value: JSON.stringify(apiData,null,2),
              }}
            />
            </div>
          </div>
          <div id="editor-result">
            <div className="tab">
              <button className={toggleStateResult === 1 ? 'active-tabs' : ''} onClick={() => toggleTabResult(1)}>Result</button>
              <button className={toggleStateResult === 2 ? 'active-tabs' : ''} onClick={() => toggleTabResult(2)}>Headers<i className={Object.keys(resultHeader).length > 0 ? "header-len" : "d-none"}>{Object.keys(resultHeader).length}</i></button>
              {time !== 0 ? <button style={{color:"#0d6efd", border:"none"}}>{time}</button> : '' }
              {statusColor.des ? <button id="status-btn" style={{backgroundColor: statusColor.color}}>{statusColor.des}</button>: ''}
            </div>
            <div className={toggleStateResult === 1 ? "activeContent" : "tabContent"}>
            {
              typeof result !== 'undefined' ?  <DbEditor data={result}/> : <DbEditor/>
            }
            </div>
            <div className={toggleStateResult === 2 ? "activeContent" : "tabContent"}>
                <ul id="result-header">
                {
                  Object.keys(resultHeader).map((e) => {
                    return <li key={resultHeader[e]}>{resultHeader[e]}</li>
                  })
                }
                </ul>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    </div>
    </>
  );
}

export default Home;
