import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as bodySegmentation from '@tensorflow-models/body-segmentation';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-converter';
import '@tensorflow/tfjs-backend-webgl';
import './App.css';

// Uncomment the line below if you want to use TensorFlow.js runtime.
// import '@tensorflow/tfjs-converter';

// Uncomment the line below if you want to use MediaPipe runtime.
import '@mediapipe/selfie_segmentation';

function App() {

  const webcamRef = useRef(null);
  const canvasRef2 = useRef(null);

  useEffect(() => {
    const runModel = async () => {
      const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
      console.log("model loaded")


      const segmenterConfig = {
        runtime: 'mediapipe', // or 'tfjs'
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation',
        modelType: 'general' // or 'landscape'
      };
      const segmenter = await bodySegmentation.createSegmenter(model, segmenterConfig);


      // const segmentationConfig = { multiSegmentation: false, segmentBodyParts: false };

      const myInterval = setInterval(() => {
        const detect = async (model) => {
          // Check data is available
          if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
          ) {

            // Get Video Properties
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            // Set video width
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            // Set canvas height and width
            canvasRef2.current.width = videoWidth;
            canvasRef2.current.height = videoHeight;

            const segmentationConfig = {flipHorizontal: false};
            const people = await segmenter.segmentPeople(video, segmentationConfig);
            // console.log(people);

            const canvas2 = document.getElementById("canvas2");
            const ctx2 = canvasRef2.current.getContext("2d");

            const foregroundColor = { r: 0, g: 0, b: 0, a: 0 };
            const backgroundColor = { r: 0, g: 0, b: 0, a: 255 };
            // const backgroundImage = "./keith-misner-h0Vxgz5tyXA-unsplash.jpg";
            const drawContour = false;
            const foregroundThreshold = 0.5;
            const backgroundDarkeningMask = await bodySegmentation.toBinaryMask(people, foregroundColor, backgroundColor, drawContour, foregroundThreshold);
            const opacity = 0.7;
            const maskBlurAmount = 1; // Number of pixels to blur by.
            // const canvas = document.getElementById('canvas');

            requestAnimationFrame(async () => {
              const people2 = await bodySegmentation.drawMask(canvas2, video, backgroundDarkeningMask, opacity, maskBlurAmount);
            });
            // const people2 = await bodySegmentation.drawMask(canvas2, video, backgroundDarkeningMask, opacity, maskBlurAmount);
          }
        };
        detect(model)
      }, 500);
      return () => clearInterval(myInterval)
    };
    runModel();
  }, [])


  return (
    <div className="App">
      <Webcam
        className="web"
        ref={webcamRef}
        muted={true}
        // mirrored={true}  
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          top: 100,
          left: 700,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 640,
          height: 480,
        }}
      />
      <canvas
        ref={canvasRef2}
        id="canvas2"
        // mirrored={true}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          top: 100,
          left: -600,
          right: 0,
          textAlign: "center",
          zindex: 8,
          width: 640,
          height: 480,
        }}
      />
    </div>
  );
}

export default App;
