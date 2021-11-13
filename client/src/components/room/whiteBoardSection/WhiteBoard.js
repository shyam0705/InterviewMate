import React from 'react'
import './WhiteBoard.css';
import { useEffect,useRef,useState } from 'react';
import { hadnleDrawingChange } from '../../../util/wss';
export const WhiteBoard = () => {
  const canvasRef = useRef(null);
  const colorsRef = useRef(null);
  useEffect(() => {

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const colors = document.getElementsByClassName('color');
    const size=document.getElementById('size');
    
    const current = {
      color: 'black',
      size:2
    };
    const onSizeUpdate=(e)=>{
      current.size=e.target.value;
    }

    const onColorUpdate = (e) => {
      current.color = e.target.className.split(' ')[1];
    };
    size.addEventListener('change',onSizeUpdate,false);
    for (let i = 0; i < colors.length; i++) {
      colors[i].addEventListener('click', onColorUpdate, false);
    }
    let drawing = false;

    const drawLine = (x0, y0, x1, y1, color, emit,size) => {
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.strokeStyle = color;
      context.lineWidth = size;
      context.stroke();
      context.closePath();

      if (!emit) { return; }
      const w = canvas.width;
      const h = canvas.height;

     const data= {
        x0: x0 / w,
        y0: y0 / h,
        x1: x1 / w,
        y1: y1 / h,
        color,
        size
      };
      hadnleDrawingChange(data);
    }

    const onMouseDown = (e) => {
      drawing = true;
      current.x = e.clientX || e.touches[0].clientX;
      current.y = e.clientY || e.touches[0].clientY;
    };

    const onMouseMove = (e) => {
      if (!drawing) { return; }
      drawLine(current.x, current.y, e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY, current.color, true,current.size);
      current.x = e.clientX || e.touches[0].clientX;
      current.y = e.clientY || e.touches[0].clientY;
    };

    const onMouseUp = (e) => {
      if (!drawing) { return; }
      drawing = false;
      // drawLine(current.x, current.y, e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY, current.color, true);
    };

    const throttle = (callback, delay) => {
      let previousCall = new Date().getTime();
      return function() {
        const time = new Date().getTime();

        if ((time - previousCall) >= delay) {
          previousCall = time;
          callback.apply(null, arguments);
        }
      };
    };

    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('mouseout', onMouseUp, false);
    canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

    // Touch support for mobile devices
    canvas.addEventListener('touchstart', onMouseDown, false);
    canvas.addEventListener('touchend', onMouseUp, false);
    canvas.addEventListener('touchcancel', onMouseUp, false);
    canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', onResize, false);
    onResize();


  }, []);
  return(
    <div>
      <canvas ref={canvasRef} className="whiteboard" id="canvas"/>
      <div className="tools" id="tools">
        <div ref={colorsRef} className="colors">
          <div className="color black" />
          <div className="color red" />
          <div className="color green" />
          <div className="color blue" />
          <div className="color yellow" />
          <div className="color white"><i className="fa fa-eraser fa-lg" id="eraser"></i></div>
        </div>
        <div className="brushsize-container">
          Brush size: &nbsp;
          <select id="size">
            <option>2</option>
            <option>5</option>
            <option>10</option>
            <option>15</option>
          </select>
        </div>
      </div>
    </div>
  )
}
