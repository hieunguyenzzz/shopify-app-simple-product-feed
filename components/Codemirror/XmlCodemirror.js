import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/xml/xml'
import 'codemirror/theme/material.css'
import { toXML } from 'jstoxml'
import React, { useRef } from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'
function XmlCodemirror({ data, xml }) {
  const editorRef = useRef()
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
      .CodeMirror {
        position:absolute;
        top:0;
        left:0;
        right:0;bottom:0;height:100%
      }
    `,
        }}
      ></style>
      <CodeMirror
        value={
          xml ||
          toXML(data, {
            header: true,
            indent: '  ',
          })
        }
        options={{
          mode: 'xml',
          theme: 'material',
          lineNumbers: true,
        }}
        editorDidMount={(editor) => {
          editorRef.current = editor
        }}
        onChange={(editor, data, value) => {}}
      />
    </>
  )
}

export default XmlCodemirror
