import React from 'react'
import 'codemirror/lib/codemirror.css'
// import 'codemirror/lib/codemirror'
import 'codemirror/theme/material-ocean.css'
import 'codemirror/mode/clike/clike'
import 'codemirror/keymap/sublime'
import CodeMirror from 'codemirror'
import { handleCodeChange, handleOutputChanged } from '../../../util/wss';
import { useEffect,useState } from 'react';
import {useSelector} from 'react-redux';
import { useDispatch } from 'react-redux'
import { setLang,setOutput } from '../../../actions/setEditor';
import './Editor.css';
import axios from 'axios';
import { handleModeChanged } from '../../../util/wss'
import { setIsLoading } from '../../../actions/setIsLoading'
import { serverApi } from '../../../util/api'
export var editor=null;
export const Editor = () => {

  const state = useSelector(state => state.tmp);
  const [input, setinput] = useState("");
  const dispatch = useDispatch();
  const handleChange=(event)=>{
    handleModeChanged(event.target.value);
    editor.setOption("mode",event.target.value);
    dispatch(setLang(event.target.value));
  }
  const handleInputChange=(e)=>{
    setinput(e.target.value);
  }
  const runCode=async ()=>{
      var language="c";
      
      if(state.lang==="text/x-csrc")
      {
          language="c";
      }
      if(state.lang==="text/x-c++src")
      {
        language="cpp";
      } 
      if(state.lang==="text/x-java")
      {
        language="java";
      } 
      // console.log(language)
      dispatch(setIsLoading(true));
      try{
          const res=await axios.post(`${serverApi}/runCode`,{
                  code:editor.getValue(),
                  language:`${language}`,
                  input:input
          });

          const arr=res.data.output.split("\n");
          dispatch(setOutput(arr));
          handleOutputChanged(arr);
          //console.log(res.data.output);
      }
      catch(err){
          // console.log(err);
          // console.log("error");
      }
      dispatch(setIsLoading(false));
  }
  useEffect(() => {
      // console.log("uses effect fired");
      editor=CodeMirror.fromTextArea(document.getElementById('ds'), {
          lineNumbers: true,
          keyMap: 'sublime',
          theme: 'material-ocean',
          mode: state.lang,
      });

      editor.on('change', (instance, changes) => {
        const { origin } = changes
        // if (origin === '+input' || origin === '+delete' || origin === 'cut') {
        if (origin !== 'setValue') {
            handleCodeChange(instance.getValue());
        }
      });

    },[]);
    return (
        
        <div id="editor" className="editor">
          <div className="header">
            <select  value={state.lang} onChange={handleChange}>
                <option value="text/x-csrc">C</option>
                <option value="text/x-c++src">C++</option>
                <option value="text/x-java">JAVA</option>
            </select>
            <button onClick={runCode}>Run</button>
          </div>
          <textarea id="ds" />
          {/* <p>Output:-</p> */}
          {/* intput */}
          <div className="row">
            <div className="input">
                <label>Enter Input : </label>
                <textarea
                  value={input}
                  onChange={handleInputChange}
                />
            </div>
            <hr width="1" size="100"/>
            <div className="output">
              <p>Output:-</p>
              {state.output.map((out,index)=>{
                return(
                  <div className="outputData">
                      <pre className="tab" key={index}>{out}</pre>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
    );
}
