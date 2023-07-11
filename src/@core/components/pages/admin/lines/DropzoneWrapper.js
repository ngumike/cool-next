/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

import { Box, Input, Typography, List, ListItem, IconButton, styled } from '@mui/material';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

const Dropzone = styled(Box)(({ theme }) => ({
  height: '180px',
  padding: '50px 20px',
  borderWidth: 2,
  borderRadius: 2,
  borderStyle: 'dashed',
  outline: 'none',
  transition: 'border .24s ease-in-out'
}));

export const DropzoneWrapper = ({ value, setFieldValue }) => {
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file)));
    }
  });

  useEffect(() => {
    setFiles(value ? [value] : []);
  }, [value]);

  const handleRemoveFile = (e, file) => {
    e.stopPropagation();

    const uploadedFiles = files;
    const filtered = uploadedFiles.filter(i => i.name !== file.name);
    setFiles([...filtered]);
  };

  const fileList = files.map(file => (
    <ListItem
      key={file.name}
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        border: '1px solid rgba(93, 89, 98, 0.5)',
        borderRadius: '6px'
      }}
    >
      <Box>
        <Typography>{file.name}</Typography>
        <Typography variant='body2'>
          {Math.round(file.size / 100) / 10 > 1000
            ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
            : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
        </Typography>
      </Box>
      <IconButton onClick={e => handleRemoveFile(e, file)}>
        <Icon icon='mdi:close' fontSize={20} />
      </IconButton>
    </ListItem>
  ));

  useEffect(() => {
    if (files.length > 0) {
      setFieldValue('file', files[0]);
    } else {
      setFieldValue('file', null);
    }
  }, [files]);

  return (
    <Box>
      <Dropzone {...getRootProps({ className: 'dropzone' })}>
        <Input {...getInputProps()} />
        <Box sx={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {files.length === 0 ? (
            isDragActive ? (
              <Typography variant='body'>Drop the file here...</Typography>
            ) : (
              <Typography variant='body'>Drop file here or click to select</Typography>
            )
          ) : (
            <List sx={{ width: '100%' }}>{fileList}</List>
          )}
        </Box>
      </Dropzone>
    </Box>
  );
};
