import React from 'react';
import { toast } from 'react-toastify';

const CopyToClip = ({ children, value }) => {
  async function copyToClipBoard(e: any) {
    try {
      e.stopPropagation();
      await navigator.clipboard.writeText(value);
      toast.success('Copied Successfully', {
        autoClose: 2000,
        pauseOnHover: false,
      });
    } catch (error) {
      console.log('error', error);
    }
  }
  return <div onClick={(e) => copyToClipBoard(e)}>{children}</div>;
};

export default CopyToClip;
