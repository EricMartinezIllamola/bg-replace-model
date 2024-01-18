// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as bodySegmentation from '@tensorflow-models/body-segmentation';
import '@mediapipe/selfie_segmentation';
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
  const canvasRefInv = useRef(null);

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
      const model_bg = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
      setModelLoaded(true);

      const segmenterConfig = {
        runtime: 'mediapipe', // or 'tfjs'
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation',
        modelType: 'landscape' // or 'landscape'
      };
      const segmenter = await bodySegmentation.createSegmenter(model_bg, segmenterConfig);

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

            canvasRefInv.current.width = videoWidth;
            canvasRefInv.current.height = videoHeight;

            const canvas = document.getElementById("canvas");
            const canvasSec = document.getElementById("canvasSec");
            const canvasInv = document.getElementById("canvasSec");
            const canvas2 = document.getElementById("canvas2");

            // Draw Detection Zone
            const ctx = canvasRef.current.getContext("2d");
            const ctxSec = canvasRefSec.current.getContext("2d");
            const ctxInv = canvasRefInv.current.getContext("2d");
            const ctx2 = canvasRef2.current.getContext("2d");

            const segmentationConfig = { flipHorizontal: false };

            const image = document.getElementById("source");

            const people_bg = await segmenter.segmentPeople(video, segmentationConfig);

            if (people_bg.length > 0) {
              const personMask_bg = people_bg[0].mask;
              const personMaskCanvas_bg = await personMask_bg.toCanvasImageSource();

              // Draw the person's mask on the canvas
              ctx2.drawImage(video, 0, 0, 640, 480);

              // // Draw the person's mask on the canvas with a white color
              ctx2.globalCompositeOperation = 'destination-in';
              ctx2.drawImage(personMaskCanvas_bg, 0, 0, 640, 480);
              // ctx2.globalCompositeOperation = 'destination-over';
              // ctx2.drawImage(image, 0, 0, 640, 480);
              ctx2.globalCompositeOperation = 'source-over'; // Reset composite operation
              // ctx2.drawImage(video, x, y, width, height, x, y, width, height);

              // ctxSec.save();  // Save the current state of the context
              // ctxSec.scale(-1, 1);  // Flip horizontally
              ctxSec.drawImage(video, 0, 0, 640, 480);
              // ctxSec.restore();
              ctxSec.globalCompositeOperation = 'destination-in';
              ctxSec.drawImage(personMaskCanvas_bg, 0, 0, 640, 480);
              ctxSec.globalCompositeOperation = 'destination-over';
              ctxSec.fillStyle = 'rgba(240, 240, 240, 0.8)';
              // ctxSec.fillStyle = 'rgba(220, 230, 255, 0.8)';
              // ctxSec.fillStyle = 'rgba(220, 255, 230, 0.8)';
              // ctxSec.fillStyle = 'rgba(200, 255, 200, 0.8)';
              ctxSec.fillRect(0, 0, 640, 480);
              ctxSec.globalCompositeOperation = 'source-over';

              ctx.drawImage(canvasSec, x, y, width, height, 0, 0, 640, 480);

              // const imageData = ctx.getImageData(0, 0, 640, 480);
              // const data = imageData.data;

              // for (let i = 0; i < data.length; i += 4) {
              //   const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
              //   data[i] = avg;
              //   data[i + 1] = avg;
              //   data[i + 2] = avg;
              // }

              // ctxInv.putImageData(imageData, 0, 0);
            }

            // Make Detections
            const img = tf.browser.fromPixels(canvas)
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
      en.lang = "en-US";
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
        // mirrored={true}
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
        ref={canvasRefInv}
        id="canvasInv"
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

      <canvas
        ref={canvasRefSec}
        id="canvasSec"
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