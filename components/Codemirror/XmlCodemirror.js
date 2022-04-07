import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/xml/xml'
import 'codemirror/theme/material.css'
import { toXML } from 'jstoxml'
import React from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'
function XmlCodemirror({ data }) {
  return (
    <CodeMirror
      value={toXML(data, {
        header: true,
        indent: '  ',
      })}
      options={{
        mode: 'xml',
        theme: 'material',
        lineNumbers: true,
      }}
      onChange={(editor, data, value) => {}}
    />
  )
}

export default XmlCodemirror
