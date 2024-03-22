import { Center, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import React, { Suspense, useEffect, useRef } from 'react';
import { Box3, Vector3 } from 'three';

interface ModelProps {
    url: string;
}
function Model({ url }: ModelProps) {
    const { scene } = useGLTF(url);
    const { camera } = useThree();

    useEffect(() => {
        // Calculate the bounding box of the model
        const bbox = new Box3().setFromObject(scene);
        const center = bbox.getCenter(new Vector3());
        const size = bbox.getSize(new Vector3());

        // Calculate the distance the camera needs to be from the center of the model
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180) * 0.5;
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

        // Adjust for the camera's aspect ratio
        const aspect = camera.aspect;
        cameraZ /= aspect;

        // Set the camera position
        camera.position.z = center.z + cameraZ;
        camera.position.x = center.x;
        camera.position.y = center.y;

        // Update the camera's near and far planes
        camera.near = cameraZ / 100;
        camera.far = cameraZ * 100;

        // Update the camera
        camera.updateProjectionMatrix();
    }, [scene, camera]);

    return (
        <>
            <primitive object={scene} />
        </>
    );
}

interface ViewerProps {
    url: string;
}
export const GlbViewer = ({ url }: ViewerProps) => {
    return (
        <Canvas pixelRatio={[1, 2]} camera={{ position: [-10, 15, 15], fov: 60 }}>
            <Center>
                <Model url={url} />
            </Center>
            <ambientLight intensity={4} />
            <Suspense fallback={null}></Suspense>
            <OrbitControls enablePan={false} zoomSpeed={0.2} />
        </Canvas>
    );
};
