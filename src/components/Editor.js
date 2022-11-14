import React, { useEffect, useRef } from 'react'
import Codemirror from 'codemirror'
import "codemirror/lib/codemirror.css"
import "codemirror/theme/dracula.css"
import "codemirror/theme/ttcn.css"
import "codemirror/mode/javascript/javascript.js"
import "codemirror/mode/cmake/cmake.js"
import "codemirror/mode/clike/clike.js"
import "codemirror/addon/edit/closetag"
import "codemirror/addon/edit/closebrackets"
import ACTIONS from '../ACTIONS'

const Editor = ({socketRef , RoomId ,onCodeChange}) => {

  // useEffect(() => {
  //   async function init() {
  //     Codemirror.fromTextArea(document.getElementById('collaborativeEditor'), {

  //       mode: {name: 'javascript', json: true} ,
  //       theme: 'default',
  //       autoCloseTags: true ,
  //       autoCloseBrackets: true ,
  //       lineNumbers : true 
  //     } );
  //   };
  //   init();
  // }, [] );
  // class a extends React.PureComponent {
  //   componentDidMount() {
  //     loadDataOnlyOnce();
  //   }
  // }

  
  const editorRef = useRef(null);
  useEffect(() => {
    function init() {
        editorRef.current = Codemirror.fromTextArea(
            document.getElementById('collaborativeEditor'),
            {
                mode: { name: 'text/x-c++src', json: true },
                theme: 'dracula',
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true,
            }
        );

        editorRef.current.on('change', (instance, changes) => {
          console.log('changes', changes);
          // console.log(instance);
          // console.log(origin);
          const {origin} = changes;
          const code= instance.getValue();
          onCodeChange(code);
          // console.log(code);
          if(origin !== 'setValue')
          {
            // console.log('working', code)
            let linenumber = editorRef.current.getCursor();
            // console.log(linenumber)
            socketRef.current.emit(ACTIONS.CODE_CHANGE, {
              RoomId,
              code,
              linenumber
            });
          }

        });

        editorRef.current.setValue("#include<iostream>\n\nusing namespace std;\n\nint main()\n{\n  cout<<\"Hello World!\";\n  return 0;\n}")
    };
    init(); 
    
}, []);

useEffect(() => {
  if (socketRef.current) {
    // console.log('not null')
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code, linenumber }) => {
        // console.log('receiveing',code);
        // console.log('linenumber',linenumber);
          if (code !== null) {
            editorRef.current.setValue(code);
            editorRef.current.setCursor({line : linenumber.line});
          }
      });
  }

  return () => {
    socketRef.current.off(ACTIONS.CODE_CHANGE);
  }

}, [socketRef.current]);

  return (
    <textarea id='collaborativeEditor' >
    </textarea>
  )
}

export default Editor