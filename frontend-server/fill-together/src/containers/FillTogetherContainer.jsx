import React, { useEffect, useState } from 'react';
import LoginBarContainer from './LoginBarContainer';
import ArtifactsContainer from './ArtifactsContainer';
import CanvasContainer from './CanvasContainer';
import { fetchArtifacts } from '../apis/artifacts';

const API_URL = 'http://3.37.161.56:8000';
export default function FillTogetherContainer() {
  const [currentArtifactId, setCurrentArtifactId] = useState(undefined);
  const [boughtCellId, setBoughtCellId] = useState('');
  const [previewInitialized, setPreviewInitialized] = useState(false);

  useEffect(() => {
    const args = {
      baseDomain: API_URL
    };

    fetchArtifacts(args)
      .then(res => {
        const artifactsId = res.data[res.data.length - 1].id;
        setCurrentArtifactId(artifactsId.toString());
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <LoginBarContainer />
      <ArtifactsContainer
        currentArtifactId={currentArtifactId}
        setBoughtCellId={setBoughtCellId}
        setPreviewInitialized={setPreviewInitialized}
      />
      <CanvasContainer
        currentArtifactId={currentArtifactId}
        boughtCellId={boughtCellId}
        previewInitialized={previewInitialized}
        setPreviewInitialized={setPreviewInitialized}
      />
    </div>
  );
}
