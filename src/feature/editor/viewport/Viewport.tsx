/* eslint-disable react/no-unknown-property */
/* eslint-disable react/jsx-props-no-spreading */
import { CameraControls, Grid } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  sceneSelector
} from '../../../redux/slices/scene';
import Model from '../Model';

function Ground() {
  const gridConfig = {
    cellSize: 0.5,
    cellThickness: 0.5,
    cellColor: '#6f6f6f',
    sectionSize: 3,
    sectionThickness: 1,
    sectionColor: '#595959',
    fadeDistance: 50,
    fadeStrength: 1,
    followCamera: false,
    infiniteGrid: true,
  };
  return <Grid position={[0, -0.01, 0]} args={[10.5, 10.5]} {...gridConfig} />;
}

function Viewport(): JSX.Element {
  const { scene } = useSelector(sceneSelector);
  const cameraControlRef = useRef<CameraControls | null>(null);

  // function to download data, but we have to add setting state to use it
  // const [models, setModels] = useState<
  //   { [id: number]: SceneObject } | undefined
  // >(undefined);
  // useEffect(() => {
  //   const loadProjectData = async (): Promise<void> => {
  //     const user = auth.currentUser;
  //     if (user) {
  //       const userId = user.uid;
  //       try {
  //         const projects: Projects = await fetchProjectsData(userId);

  //         const projectIds = Object.keys(projects);

  //         if (projectIds.length === 0) {
  //           console.warn('No projects found for the user.');
  //           return;
  //         }

  //         const firstProjectId = projectIds[0];

  //         const project = await getProject(firstProjectId, userId);

  //         const modelsArray = project.objects;
  //         console.log(modelsArray);
  //         setModels(modelsArray);
  //       } catch (error) {
  //         console.error(
  //           'Error while downloading and loading project data',
  //           error,
  //         );
  //       }
  //     }
  //   };

  //   loadProjectData();
  // }, []);

  return (
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 2000,
        position: [5, 5, 5],
      }}
      gl={{ antialias: true }}
      scene={{}}
    >
      <CameraControls
        ref={cameraControlRef}
        maxDistance={30}
        maxPolarAngle={Math.PI / 2}
      />
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      {Object.values(scene.objects).map((model) => (
        <Model
          id={model.id}
          color={model.color}
          key={model.id}
          url={model.url}
          position={model.position}
          rotation={model.rotation}
          dbId={model.dbId}
          name={model.name || ''}
          hovered={model.hovered}
          active={model.active}
        />
      ))}
      <Ground />
    </Canvas>
  );
}

export default Viewport;
