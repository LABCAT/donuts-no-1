import React, { useRef, useEffect } from "react";
import "./globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import TriadicColorCalculator from "./TriadicColorCalculator.js";
import audio from "../audio/donuts-no-1.ogg";
import cueSet1 from "./cueSet1.js";
import cueSet2 from "./cueSet2.js";



const P5Sketch = () => {
    const sketchRef = useRef();

    const Sketch = p => {
      p.canvas = null;

      p.canvasWidth = window.innerWidth;

      p.canvasHeight = window.innerHeight;

      p.song = null;

      p.tempo = 90;

      p.barAsSeconds = Math.floor((60 / p.tempo) * 4 * 100000) / 100000;

      p.midiRange = {
        low: 40,
        high: 65,
      };


      p.midiRange2 = {
        low: 40,
        high: 65,
      };

      p.cueSet1Completed = [];

      p.cueSet2Completed = [];

      p.colours = [];

      p.shapeOptions = ["ellipse", "rect", "equilateral", "hexagon", "octagon"];

      p.bassShape = null;

      p.shapeSize = p.canvasWidth / 32;

      p.preload = () => {
        p.song = p.loadSound(audio);
      };

      p.setup = () => {
        p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
        p.rectMode(p.CENTER);
        p.background(0);
        p.colorMode(p.HSB);
        p.noFill();
        p.strokeWeight(0.5);
        p.bassShape = p.random(p.shapeOptions);
        p.colours = TriadicColorCalculator(p.random(0, 360), p.random(50, 100));
        p.song.onended(p.logCredits);

        for (let i = 0; i < cueSet1.length; i++) {
          let vars = {
            currentCue: i + 1,
            time: cueSet1[i].time,
            duration: cueSet1[i].duration,
            midi: cueSet1[i].midi,
          };
          p.song.addCue(cueSet1[i].time, p.executeCueSet1, vars);
        }

        for (let i = 0; i < cueSet2.length; i++) {
          let vars = {
            currentCue: i + 1,
            time: cueSet2[i].time,
            duration: cueSet2[i].duration,
            midi: cueSet2[i].midi,
          };
          p.song.addCue(cueSet2[i].time, p.executeCueSet2, vars);
        }
      };

      p.draw = () => {
        if (p.song && p.song.isPlaying()) {

        }
      };

      p.executeCueSet1 = (vars) => {
        if (!p.cueSet1Completed.includes(vars.currentCue)) {
          p.cueSet1Completed.push(vars.currentCue);
          let x = Math.floor(vars.time * 100000) / 100000;
          if (parseFloat(x) >= parseFloat(p.barAsSeconds)) {
            while (x >= p.barAsSeconds) {
              x = x - p.barAsSeconds;
            }
            x = x > 0 ? x : 0;
          }
          const xPos = p.width / 32 + (p.width / p.barAsSeconds) * x;
          const yPos = p.map(
            vars.midi,
            p.midiRange.low,
            p.midiRange.high,
            p.height - p.shapeSize / 2,
            0 + p.shapeSize / 2
          );
          if (vars.currentCue < 178) {
            p.drawDonut(
              p.random(p.colours),
              xPos,
              yPos,
              p.random(p.shapeOptions),
              p.shapeSize
            );
          } else {
            const steps = 360;
            const delayAmount = parseInt(vars.duration * 1000) / steps;
            const finalShape = "ellipse";
            const shapeReducer = p.shapeSize / steps;
            for (let i = 0; i < steps; i++) {
              setTimeout(function () {
                p.rotate(-p.PI / 360);
                p.drawDonut(
                  p.random(p.colours),
                  xPos,
                  yPos,
                  finalShape,
                  p.shapeSize - i * shapeReducer
                );
              }, delayAmount * i);
            }
          }
          p.shapeSize++;
        }
      };

       p.executeCueSet2 = (vars) => {
         if (!p.cueSet2Completed.includes(vars.currentCue)) {
            p.cueSet2Completed.push(vars.currentCue);
            let x = Math.floor(vars.time * 100000) / 100000;
            if (parseFloat(x) >= parseFloat(p.barAsSeconds)) {
                while (x >= p.barAsSeconds) {
                x = x - p.barAsSeconds;
                }
                x = x > 0 ? x : 0;
            }
            const xPos = p.width / 32 + (p.width / p.barAsSeconds) * x;
            const yPos = p.map(
                vars.midi,
                p.midiRange2.low,
                p.midiRange2.high,
                0 + p.canvasWidth / 64,
                p.height - p.canvasWidth / 64
            );
            if (vars.currentCue < 143) {
                p.drawDonut(
                    p.random(p.colours),
                    xPos,
                    yPos,
                    p.bassShape,
                    p.canvasWidth / 32
                );
            } else {
              
                const steps = 360;
                const delayAmount = parseInt(vars.duration * 1000) / steps;
                const shapeReducer = p.canvasWidth / 32 / steps;
                for (let i = 0; i < steps; i++) {
                    setTimeout(function () {
                      p.rotate(p.PI / 360);
                        p.drawDonut(
                          p.random(p.colours),
                          xPos,
                          yPos,
                          p.bassShape,
                          p.canvasWidth / 32 - i * shapeReducer
                        );
                    }, delayAmount * i);
                }
            }
         }
       };

      p.drawDonut = (colour, translateX, translateY, shape, size) => {
        p.translate(translateX, translateY);

        var numOfRotations = 16;
        for (var i = 0; i < numOfRotations * 2; i++) {
          for (var j = -2; j <= 2; j++) {}

          p.stroke(colour.h, colour.s, colour.b);
          //call the function as detemined by the variable shape
          //rect and ellipse are built in p5.js
          //tri,hexa & octa are defined in this file
          p[shape](0, 20, size, size);
          p.rotate(p.PI / numOfRotations);
        }
        p.translate(-translateX, -translateY);
      };

      /*
       * function to draw an equilateral triangle with a set width
       * based on x, y co-oridinates that are the center of the triangle
       * @param {Number} x        - x-coordinate that is at the center of triangle
       * @param {Number} y      	- y-coordinate that is at the center of triangle
       * @param {Number} width    - radius of the hexagon
       */
      p.equilateral = (x, y, width) => {
        const x1 = x - width / 2;
        const y1 = y + width / 2;
        const x2 = x;
        const y2 = y - width / 2;
        const x3 = x + width / 2;
        const y3 = y + width / 2;
        p.triangle(x1, y1, x2, y2, x3, y3);
      };

      /*
       * function to draw a hexagon shape
       * adapted from: https://p5js.org/examples/form-regular-polygon.html
       * @param {Number} x        - x-coordinate of the hexagon
       * @param {Number} y      - y-coordinate of the hexagon
       * @param {Number} radius   - radius of the hexagon
       */
      p.hexagon = (x, y, radius) => {
        radius = radius / 2;
        p.angleMode(p.RADIANS);
        const angle = p.TWO_PI / 6;
        p.beginShape();
        for (var a = p.TWO_PI / 12; a < p.TWO_PI + p.TWO_PI / 12; a += angle) {
          let sx = x + p.cos(a) * radius;
          let sy = y + p.sin(a) * radius;
          p.vertex(sx, sy);
        }
        p.endShape(p.CLOSE);
      }

      /*
       * function to draw a octagon shape
       * adapted from: https://p5js.org/examples/form-regular-polygon.html
       * @param {Number} x        - x-coordinate of the octagon
       * @param {Number} y      - y-coordinate of the octagon
       * @param {Number} radius   - radius of the octagon
       */
      p.octagon = (x, y, radius) => {
        radius = radius / 2;
        p.angleMode(p.RADIANS);
        const angle = p.TWO_PI / 8;
        p.beginShape();
        for (var a = p.TWO_PI / 16; a < p.TWO_PI + p.TWO_PI / 16; a += angle) {
          let sx = x + p.cos(a) * radius;
          let sy = y + p.sin(a) * radius;
          p.vertex(sx, sy);
        }
        p.endShape(p.CLOSE);
      }

      p.mousePressed = () => {
        if (p.song.isPlaying()) {
          p.song.pause();
        } else {
          if (
            parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)
          ) {
            p.reset();
          }
          //document.getElementById("play-icon").classList.add("fade-out");
          p.canvas.addClass("fade-in");
          p.song.play();
        }
      };

      p.creditsLogged = false;

      p.logCredits = () => {
        if (
          !p.creditsLogged &&
          parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)
        ) {
          p.creditsLogged = true;
          console.log(
            "Music:",
            "\n",
            "http://labcat.nz/",
            "\n",
            "Animation:",
            "\n", 
            "https://github.com/LABCAT/donuts-no-1",
            "\n",
            "Colour Inspiration (Tetradic Color Harmony):",
            "\n", 
            "https://codepen.io/collection/XzVggR?cursor=ZD0wJm89MCZwPTEmdj02NA==",
            "\n",
            "https://www.tigercolor.com/color-lab/color-theory/color-harmonies.htm"
          );
        }
      };

      p.reset = () => {
        p.clear();
      };

      p.updateCanvasDimensions = () => {
        p.canvasWidth = window.innerWidth;
        p.canvasHeight = window.innerHeight;
        p.createCanvas(p.canvasWidth, p.canvasHeight);
        p.redraw();
      };

      if (window.attachEvent) {
        window.attachEvent("onresize", function () {
          p.updateCanvasDimensions();
        });
      } else if (window.addEventListener) {
        window.addEventListener(
          "resize",
          function () {
            p.updateCanvasDimensions();
          },
          true
        );
      } else {
        //The browser does not support Javascript event binding
      }
    };

    useEffect(() => {
        new p5(Sketch, sketchRef.current);
    }, []);

    return (
        <div ref={sketchRef}>
        </div>
    );
};

export default P5Sketch;
