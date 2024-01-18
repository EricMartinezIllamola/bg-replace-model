import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
// import '@tensorflow/tfjs-backend-core';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as bodySegmentation from '@tensorflow-models/body-segmentation';
// import '@tensorflow/tfjs-converter';
import '@mediapipe/selfie_segmentation';
import './App.css';

function App() {

    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    // const backgroundImage = new Image();
    // backgroundImage.src = "../src/jungle-1807476_640.jpg";

    useEffect(() => {
        const runModel = async () => {
            const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
            console.log("model loaded");


            const segmenterConfig = {
                runtime: 'mediapipe', // or 'tfjs'
                solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation',
                modelType: 'general' // or 'landscape'
            };
            const segmenter = await bodySegmentation.createSegmenter(model, segmenterConfig);
            // console.log("segmenter created");

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
                        canvasRef.current.width = videoWidth;
                        canvasRef.current.height = videoHeight;

                        const segmentationConfig = { flipHorizontal: false };
                        const people = await segmenter.segmentPeople(video, segmentationConfig);
                        // console.log("people created");

                        const canvas = document.getElementById("canvas");
                        const ctx = canvasRef.current.getContext("2d");
                        const image = document.getElementById("source");

                        // const foregroundColor = { r: 0, g: 0, b: 0, a: 0 };
                        // const backgroundColor = { r: 255, g: 255, b: 255, a: 255 };
                        // const drawContour = false;
                        // const foregroundThreshold = 0.2;
                        // const backgroundDarkeningMask = await bodySegmentation.toBinaryMask(people, foregroundColor, backgroundColor, drawContour, foregroundThreshold);
                        // const opacity = 1;
                        // const maskBlurAmount = 0; // Number of pixels to blur by.

                        // await bodySegmentation.drawMask(canvas, video, backgroundDarkeningMask, opacity, maskBlurAmount);


                        if (people.length > 0) {
                            const personMask = people[0].mask;
                            const personMaskCanvas = await personMask.toCanvasImageSource();

                            // Draw the person's mask on the canvas
                            ctx.drawImage(video, 0, 0, 640, 480);

                            // // Draw the person's mask on the canvas with a white color
                            ctx.globalCompositeOperation = 'destination-in';
                            ctx.drawImage(personMaskCanvas, 0, 0, 640, 480);
                            ctx.globalCompositeOperation = 'destination-over';
                            ctx.drawImage(image, 0, 0, 640, 480);
                            ctx.globalCompositeOperation = 'source-over'; // Reset composite operation
                        }

                    }
                };
                detect(model)
            }, 32);
            return () => clearInterval(myInterval)
        }

        runModel();

    }, [])


    return (
        <div className="App">
            <div className="bg_image"></div>
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
                ref={canvasRef}
                id="canvas"
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
            <div style={{ display: "none" }}>
                <img id="source" src={require("./jungle-1807476_640.jpg")} />
            </div>
        </div>
    );
}

export default App;