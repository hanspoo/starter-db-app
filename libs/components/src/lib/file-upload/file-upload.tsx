import React, { useState } from 'react';
import axios from 'axios';
import { Spin } from 'antd';

type UploadResponse = {
  msg: string;
};

const FileUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<UploadResponse>();

  // a local state to store the currently selected file.
  const [selectedFile, setSelectedFile] = React.useState('');

  const handleSubmit = async (event: any) => {
    setLoading(true);
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', selectedFile);
    axios({
      method: 'post',
      url: '/api/files/upload',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(JSON.stringify(error));
        setLoading(false);
      });
  };

  const handleFileSelect = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  if (loading) return <Spin />;
  if (error) return <p>{error}</p>;
  if (data) return <p>{data.msg}</p>;

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileSelect} />
      <input type="submit" value="Upload File" />
    </form>
  );
};

export { FileUpload };
