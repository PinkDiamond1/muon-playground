import withReactContent from 'sweetalert2-react-content'
import ApiEditor from "../ApiEditor/ApiEditor";
import DbEditor from "../DbEditor/DbEditor";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { store } from "../../store";
import Swal from 'sweetalert2'
import axios from 'axios'
import { useParams } from 'react-router-dom';
import '../../App.css'
import {useLocation} from "react-router-dom";


function Home() {
  const {slug} = useParams()
  console.log(slug)
  const dispatch = useDispatch()
  const MySwal = withReactContent(Swal)
  var apiData = store.getState().apiData.apiData
  const [apiUrl, setApiUrl] = useState('')
  const [uniqueName, setUniqueName] = useState('')
  const [method , setMethod] = useState('get')
  const [result, setResult] = useState()
  const [resultHeader, setResultHeader] = useState({})
  console.log(slug)
  const [toggleState, setToggleState] = useState(1);
  const [toggleStateResult, setToggleStateResult] = useState(1)
  const [time, setTime] = useState(0)
  const [statusColor, setStatusColor] = useState({color: '', des: ''})
  const search = useLocation().search;
  const run = new URLSearchParams(search).get('run');
  console.log(run)
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
      if (slug !== '') {
        console.log(slug)
        let data = {name: slug}
        await axios.post('https://playground-api.muon.net/getDataByName', data)
        .then((response) => {
          // console.log(response)
          setApiUrl(response.data.response.url)
          dispatch({
            type: "API_DATA",
            payload: {
              apiData: response.data.response.data,
            } 
          })
          setUniqueName(response.data.response.name)
          setMethod(response.data.response.method)
          if (Number(run) === 1 && apiUrl.trim().length !== 0) {
            muonize()
            clearInterval(interval)
          }
        })
        .catch(error => console.log(error))
      }
    }
    fetchData()
  }, [apiUrl, run, slug, dispatch])

  

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
    apiData = store.getState().apiData.apiData
    try{
      data = JSON.parse(apiData) 
    }
    catch{
      data = {}
    }
    console.log(typeof(data))
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

  return (
    
    <div className="Home" >
      <Header apiData={apiData} apiUrl={apiUrl} uniqueName={uniqueName} method={method}/>
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
              <ApiEditor/>
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
  );
}

export default Home;
