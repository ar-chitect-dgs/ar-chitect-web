/* eslint-disable guard-for-in */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import React, { useState } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
} from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { db, storage } from '../firebaseConfig';
import { useAuth } from '../auth/AuthProvider';

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

        for (const variantKey in jsonData.color_variants) {
          const variant = jsonData.color_variants[variantKey];

          const thumbPath = `modelThumbnails/${variant.url.replace('.glb', '.png')}`;
          const thumbRef = ref(storage, thumbPath);
          const thumbUrl = await getDownloadURL(thumbRef);

          const modelPath = `models/${variant.url}`;
          const modelRef = ref(storage, modelPath);
          const modelUrl = await getDownloadURL(modelRef);

          variant.thumb = thumbUrl;
          variant.modelUrl = modelUrl;
        }

        const docId = file.name.replace('.json', '');
        const docRef = doc(collection(db, collectionName), docId);
        await setDoc(docRef, jsonData);

        console.log(
          `Uploaded ${file.name} to Firestore collection "${collectionName}" with ID "${docId}".`,
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

const MoveAllToTemplates: React.FC = () => {
  const { user, isLoggedIn } = useAuth();
  const [templateName, setTemplateName] = useState('');

  const handleMoveAll = async () => {
    if (!isLoggedIn || !user) {
      alert('You must be logged in to perform this action.');
      return;
    }

    if (!templateName.trim()) {
      alert('Please provide a valid template name.');
      return;
    }

    try {
      const userId = user.uid;
      const userProjectsRef = collection(db, 'users', userId, 'projects');
      const templateSubCollectionRef = collection(
        db,
        'templates',
        templateName,
        'projects',
      );

      const snapshot = await getDocs(userProjectsRef);

      if (snapshot.empty) {
        alert(`No projects found for user "${userId}".`);
        return;
      }

      const batch = snapshot.docs.map(async (projectDoc) => {
        const projectData = projectDoc.data();
        const projectId = projectDoc.id;

        // Save the project in the template's subcollection
        const templateRef = doc(templateSubCollectionRef, projectId);
        await setDoc(templateRef, { ...projectData, movedBy: userId });

        // Optionally delete the original project
        await deleteDoc(doc(userProjectsRef, projectId));
      });

      await Promise.all(batch);

      alert(
        `All projects moved to the template "${templateName}" successfully.`,
      );
    } catch (error) {
      console.error('Failed to move projects:', error);
      alert(
        'An error occurred while moving projects. Check the console for details.',
      );
    }
  };

  return (
    <div style={{ marginTop: 16 }}>
      <h3>Move All My Projects to Templates</h3>
      <div>
        <FormControl margin="normal">
          <InputLabel id="template-select-label">Template category</InputLabel>
          <Select
            labelId="template-select-label"
            value={templateName}
            sx={{ width: 200 }}
            onChange={(e) => setTemplateName(e.target.value)}
          >
            <MenuItem value="Kitchen">Kitchen</MenuItem>
            <MenuItem value="Bedroom">Bedroom</MenuItem>
            <MenuItem value="Bathroom">Bathroom</MenuItem>
          </Select>
        </FormControl>
      </div>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleMoveAll}
        style={{ marginTop: 16 }}
      >
        Move All Projects
      </Button>
    </div>
  );
};

const Dev = (): JSX.Element => (
  <div style={{ paddingLeft: 30 }}>
    <h1>DEV SETTINGS</h1>
    <UploadJsonFiles />
    <Divider style={{ margin: '16px 0' }} />
    <MoveAllToTemplates />
  </div>
);

export default Dev;
