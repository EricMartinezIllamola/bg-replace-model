// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@mediapipe/pose';
import "./camara_05.css";


function argMax(array) {
  return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function App(props) {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasRef2 = useRef(null);
  const canvasRefSec = useRef(null);

  const numArray = props.array;
  const [referencia, setReferencia] = useState(randomElement(numArray));
  const [results, setResults] = useState([]);
  const [points, setPoints] = useState(0);
  const [timer, setTimer] = useState(90);

  const [change, setChange] = useState(false);
  const [start, setStart] = useState(true);
  const [end, setEnd] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);

  // Detection Zone y Cuadrado
  const [x, setX] = useState(25);
  const [y, setY] = useState(25);
  const [width, setWidth] = useState(320);
  const [height, setHeight] = useState(240);

  const labelMap = props.model.label;

  const imgpath = props.model.imgpath;

  const ayuda = props.ayuda;

  // Main function

  useEffect(() => {
    const runModel = async () => {

      await tf.ready();

      const selectedModel = await props.model.model;

      const model = await tf.loadGraphModel(selectedModel);
      const model_bg = poseDetection.SupportedModels.BlazePose;
      setModelLoaded(true);

      const detectorConfig = {
        runtime: 'mediapipe',
        enableSmoothing: true, // You can adjust this based on your needs
        enableSegmentation: true, // Set this to true if you want segmentation
        smoothSegmentation: true, // Adjust as needed
        modelType: 'heavy', // Choose the appropriate model type (lite, full, heavy)
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose',
      };
      const detector = await poseDetection.createDetector(model_bg, detectorConfig);

      //  Loop and detect hands

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

            canvasRef2.current.width = videoWidth;
            canvasRef2.current.height = videoHeight;

            canvasRefSec.current.width = videoWidth;
            canvasRefSec.current.height = videoHeight;

            const canvas = document.getElementById("canvas");
            const canvasSec = document.getElementById("canvasSec");
            const canvas2 = document.getElementById("canvas2");

            // Draw Detection Zone
            const ctx = canvasRef.current.getContext("2d");
            const ctxSec = canvasRefSec.current.getContext("2d");
            const ctx2 = canvasRef2.current.getContext("2d");

            ctx.drawImage(video, x, y, width, height, 0, 0, 640, 480);

            const estimationConfig = { enableSmoothing: true };
            const poses_bg = await detector.estimatePoses(video, estimationConfig);
            const poses = await detector.estimatePoses(canvas, estimationConfig);

            if (poses_bg.length > 0) {
              const personMask_bg = poses_bg[0].segmentation.mask;
              const personMaskCanvas_bg = await personMask_bg.toCanvasImageSource();

              // Draw the person's mask on the canvas
              ctx2.drawImage(video, 0, 0, 640, 480);

              // // Draw the person's mask on the canvas with a white color
              ctx2.globalCompositeOperation = 'destination-in';
              ctx2.drawImage(personMaskCanvas_bg, 0, 0, 640, 480);
              ctx2.globalCompositeOperation = 'source-over'; // Reset composite operation

              // ctxSec.drawImage(video, 0, 0, 640, 480);
              // ctxSec.globalCompositeOperation = 'destination-in';
              // ctxSec.drawImage(personMaskCanvas_bg, 0, 0, 640, 480);
              // ctxSec.globalCompositeOperation = 'destination-over';
              // ctxSec.fillStyle = 'rgba(255, 255, 255, 0.8)';
              // ctxSec.fillRect(0, 0, 640, 480);
              // ctxSec.globalCompositeOperation = 'source-over';

              // ctx.drawImage(canvasSec, x, y, width, height, 0, 0, 640, 480);
          }

            const image = document.getElementById("source");

            if (poses.length > 0) {

              const personMask = poses[0].segmentation.mask;
              const personMaskCanvas = await personMask.toCanvasImageSource();
              ctxSec.drawImage(canvas, 0, 0, 640, 480);
              ctxSec.globalCompositeOperation = 'destination-in';
              ctxSec.drawImage(personMaskCanvas, 0, 0, 640, 480);
              ctxSec.globalCompositeOperation = 'destination-over';
              ctxSec.fillStyle = 'rgba(255, 255, 255, 0.8)';
              ctxSec.fillRect(0, 0, 640, 480);
              ctxSec.globalCompositeOperation = 'source-over';

              // // Draw the person's mask on the canvas
              // ctx2.drawImage(video, 0, 0, 640, 480);

              // // // Draw the person's mask on the canvas with a white color
              // ctx2.globalCompositeOperation = 'destination-in';
              // ctx2.drawImage(personMaskCanvas, 0, 0, 640, 480);
              // ctx2.globalCompositeOperation = 'source-over'; // Reset composite operation
          }

            // Make Detections
            const img = tf.browser.fromPixels(canvasSec)
            const resized = tf.image.resizeBilinear(img, [56, 56])
            const expanded = resized.expandDims(0)
            const obj = await model.execute(expanded)
            const predictedValue = argMax(obj.arraySync()[0]);

            setResults(prevState => ([...prevState.slice(-9), predictedValue]));

            // Draw Cuadrado y Results
            const drawRect = (predictedValue, ctx, x, y, width, height) => {
              // Set styling
              ctx.strokeStyle = labelMap[predictedValue]['color']
              ctx.lineWidth = 1
              ctx.fillStyle = labelMap[predictedValue]['color']
              ctx.font = '70px Arial'

              // DRAW!!
              ctx.beginPath()
              ctx.rect(x, y, width, height);
              ctx.fillText(labelMap[predictedValue]['name'], (x + (width / 2.5)), (y + 310))
              ctx.stroke()
            }
            // const ctx2 = canvasRef2.current.getContext("2d");
            requestAnimationFrame(() => { drawRect(predictedValue, ctx2, x, y, width, height) });

            tf.dispose(img);
            tf.dispose(resized);
            tf.dispose(expanded);
            tf.dispose(obj);
            tf.dispose(predictedValue);
          }
        };
        detect(model)
      }, 200);
      return () => clearInterval(myInterval)
    };
    runModel();
  }, []);

  useEffect(() => {
    if (results.filter(x => x === referencia).length === 7) {
      setResults([]);
      if (timer > 0 && start) {
        setPoints(points + 1);
        setReferencia(randomElement(numArray));
        setChange(!change);
      }
      else if (timer === 0 && start) {
        setReferencia(randomElement(numArray));
      }
    }
    else if (timer <= 0 && start) {
      setEnd(true);
    }
  }, [results]);

  useEffect(() => {
    if (timer > 0 && start) {
      const synth = window.speechSynthesis;
      const en = new SpeechSynthesisUtterance(labelMap[referencia]['name']);
      en.lang = "es-US";
      synth.speak(en);
    }
  }, [change])

  useEffect(() => {
    timer > 0 && start && setTimeout(() => setTimer(timer - 1), 1000);
  }, [timer])

  return (
    <div className="App">

      <Webcam
        className="web"
        ref={webcamRef}
        muted={true}
        style={{
          visibility: "hidden",
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          top: 100,
          left: 500,
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
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          top: 100,
          left: 500,
          right: 0,
          textAlign: "center",
          zindex: 8,
          width: 640,
          height: 480,
        }}
      />

      <canvas
        ref={canvasRef}
        id="canvas"
        style={{
          display: "none",
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: -500,
          right: 0,
          textAlign: "center",
          zindex: 8,
          width: 640,
          height: 480,
        }}
      />

      <canvas
        ref={canvasRefSec}
        id="canvasSec"
        style={{
          // display: "none",
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: -500,
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

      <div className="left_side">
        <div className="left_up">
          <div className="left_up_mono"><img className={end ? "camara_mono camara_mono_salta" : "camara_mono"} src={require("./monohojas.png")}></img></div>
          <div className="left_up_points">
            <div><p className="timer">{timer < 10 ? "Tiempo: 0" + timer : "Tiempo: " + timer}</p></div>
            <div><p className="points">{"Puntos: " + points}</p></div>
          </div>
        </div>
        <div className="left_center">
          <img className="num_ejemplo" src={require("./" + imgpath + "/" + referencia + ".png")} alt=""></img>
          <img className="img_ejemplo" style={{ visibility: ayuda ? 'visible' : 'hidden' }} src={require("./" + imgpath + "/" + referencia + "B.png")} alt=""></img>
        </div>
      </div>
      <div className="camara_extend"></div>

    </div>
  );

}

export default App;