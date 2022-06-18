import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools"

// Render editor
function DbEditor (props) {
  return(
    <AceEditor
      mode="json"
      name="editor"
      editorProps={{ $blockScrolling: true }}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        value:JSON.stringify(props.data , null, '\t'),
        readOnly: true
      }}
    />
  )
}

export default DbEditor