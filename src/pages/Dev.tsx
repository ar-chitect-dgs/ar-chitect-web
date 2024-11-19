/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import React, { useState } from 'react';
import { collection, doc, setDoc } from 'firebase/firestore';
import { Button } from '@mui/material';
import { db } from '../firebaseConfig';

const UploadJsonFiles: React.FC = () => {
  const [collectionName, setCollectionName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles) {
      alert('Please select files to upload.');
      return;
    }

    if (!collectionName.trim()) {
      alert('Please enter a valid collection name.');
      return;
    }

    try {
      for (const file of Array.from(selectedFiles)) {
        const fileText = await file.text();
        const jsonData = JSON.parse(fileText);

        const docId = file.name.replace('.json', '');

        const docRef = doc(collection(db, collectionName), docId);
        await setDoc(docRef, jsonData);

        console.log(
          `Uploaded ${file.name} to Firestore collection "${collectionName}" with ID "${docId}"`,
        );
      }

      alert('All files uploaded successfully.');
    } catch (error) {
      console.error('Error uploading JSON files:', error);
      alert('Failed to upload files. Check the console for details.');
    }
  };

  return (
    <div>
      <h2>Upload JSON models to database</h2>
      <div>
        <label>
          Collection Name:
          <input
            type="text"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            placeholder="Enter collection name"
            style={{ marginLeft: '8px', padding: '4px' }}
          />
        </label>
      </div>
      <div style={{ marginTop: '16px' }}>
        <input
          type="file"
          accept=".json"
          multiple
          onChange={handleFileSelection}
        />
      </div>
      <div style={{ marginTop: '16px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          sx={{ marginTop: 2, alignSelf: 'start' }}
        >
          Upload Files
        </Button>
      </div>
    </div>
  );
};

const Dev = (): JSX.Element => (
  <div style={{ paddingLeft: 30 }}>
    <h1>DEV SETTINGS</h1>
    <UploadJsonFiles />
  </div>
);

export default Dev;
