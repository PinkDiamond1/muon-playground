import AceEditor from "react-ace";
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools"
import 'ace-builds/src-noconflict/worker-css';
import "ace-builds/webpack-resolver";
import './ApiEditor.css'
import { useDispatch } from 'react-redux';
import { store } from "../../store";

function ApiEditor (props) {
  var apiData = store.getState().apiData.apiData
  const dispatch = useDispatch()

  const handelOnChangeData = (newValue) => {
    dispatch({
      type: "API_DATA",
      payload: {
        apiData: newValue,
      } 
    })
  }

    return(
      <AceEditor
        mode="json"
        onChange={handelOnChangeData}
        name="editor"
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          value: JSON.stringify(apiData)
        }}
      />
    )
}

export default ApiEditor