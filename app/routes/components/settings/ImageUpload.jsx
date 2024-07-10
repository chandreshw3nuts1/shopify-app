import React, { useState, useRef } from 'react';

const DeleteBin = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M17.5 8.38797C15.5575 8.18997 13.6033 8.08797 11.655 8.08797C10.5 8.08797 9.345 8.14797 8.19 8.26797L7 8.38797M10.2083 7.78199L10.3367 6.99599C10.43 6.426 10.5 6 11.4858 6H13.0142C14 6 14.0758 6.45 14.1633 7.00199L14.2917 7.78199M16.2458 10.2841L15.8666 16.326C15.8024 17.268 15.7499 18 14.1224 18H10.3774C8.74994 18 8.69744 17.268 8.63328 16.326L8.25411 10.2841M11.2759 14.6999H13.2184M10.7917 12.3H13.7083" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const SingleImageUpload = () => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const inputfileimage = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.match("image/")) {
      alert(selectedFile.name + " is not an image");
      return;
    }

    setFile(selectedFile);
    setFileUrl(URL.createObjectURL(selectedFile));
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileUrl('');
    inputfileimage.current.value = null;
  };

  return (
    <div className={`imageuploadbox ${file ? 'hasfile' : ''}`}>
        <div className='filebtnbox'>
            <input type="file" id="upload-files" ref={inputfileimage} className='inputfileimage' accept="image/*" onChange={handleFileChange} />
            <label htmlFor="upload-files" className=''>Upload file</label>
        </div>

        {file && (
            <div className="files-list-container">
                <div className="listbox">
                    <div className="form__image-container">
                        <img className="form__image" src={fileUrl} alt={file.name} />
                        <div className="deleteicon" onClick={handleRemoveFile} dangerouslySetInnerHTML={{ __html: DeleteBin }} />
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default SingleImageUpload;
