import AceEditor from "react-ace";
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools"
import 'ace-builds/src-noconflict/worker-css';
import "ace-builds/webpack-resolver";
import './ApiEditor.css'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from 'axios'

function ApiEditor (props) {
  const {slug} = useParams()
  const [apiData, setApiData] = useState()

  useEffect(() => {
    const fetchData = async() => {
      if (slug != '') {
        // console.log(slug)
        let data = {name: slug}
        await axios.post('https://playground-api.muon.net/getDataByName', data)
        .then((response) => {
          setApiData(JSON.parse(response.data.response.data))
          console.log(response.data.response.data)
        })
        .catch(error => console.log(error))
      }
    }

    fetchData()
  }, [])

    return(
      <AceEditor
        mode="json"
        onChange={props.onChangeData}
        name="editor"
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          value: JSON.stringify(apiData,null,2),
        }}
      />
    )
}

export default ApiEditor