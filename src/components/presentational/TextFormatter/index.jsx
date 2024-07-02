import { useEffect, useState } from 'react';

import { EditorState, ContentState, convertToRaw } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const TextFormatter = ({
  setContent,
  htmlText,
  editorState,
  setEditorState,
}) => {
  const onTextChange = (editState) => {
    setEditorState(editState);
  };

  const text = draftToHtml(convertToRaw(editorState.getCurrentContent()));
  // setContent('description', text);

  useEffect(() => {
    const contentBlock = htmlToDraft(htmlText ?? '');
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks,
      );
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Editor
      editorState={editorState}
      editorClassName="editor"
      onEditorStateChange={onTextChange}
      toolbar={{}}
      toolbarClassName="hide-toolbar"
    />
  );
};

export default TextFormatter;
