import { Controlled as CodeMirror } from 'react-codemirror2';
require('codemirror/lib/codemirror.css');
import './CodeMirrorInput.scss';

export function CodeMirrorInput({ message, setMessage, isReadOnly = false }) {
  const options = {
    mode: {
      name: 'javascript',
      json: true,
    },
    lineNumbers: false,
    lineWrapping: true,
    theme: 'dark',
    autoCloseBrackets: false,
    tabSize: 2,
    gutters: ['CodeMirror-lint-markers'],
    lint: true,
    readOnly: isReadOnly,
  };

  return (
    <>
      <CodeMirror
        className="rounded"
        onBeforeChange={(editor, data, value) => setMessage(value)}
        options={options}
        value={message}
      />
    </>
  );
}
