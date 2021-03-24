import React, { useRef, useEffect } from "react";
import * as p5 from "p5";

const P5Sketch = () => {
    const sketchRef = useRef();

    const Sketch = p => {

        p.canvas = null;

        p.canvasWidth = window.innerWidth;

        p.canvasHeight = window.innerHeight;

        p.backgroundColours = ["#22c5ff", "#af24ff", "#ff6822", "#ffd622"];
        p.colours = ["#1e00ff", "#ff9100", "#e1ff00", "#ff00e1"];

        p.setup = () => {
            p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.background("#22c5ff");
            p.background("#ffffff");
            p.noFill();
            p.noLoop();
            p.rectMode(p.CENTER);
        };

        p.draw = () => {
            for (let i = 0; i < p.backgroundColours.length; i++) {
                setTimeout(function () {
                    
                    p.drawDonut(
                      p.backgroundColours[i],
                      (i * p.width) / 4 + p.width / 8
                    );
                    
                }, 1000 * i);
            }
        };

        p.drawDonut = (colour, canvasX) => {
            p.translate(canvasX, p.height / 2);
            var x = 0;
            var shapeSize = p.width / 16;
            var numOfRotations = 16;
          //var colour = p.random(p.colours);
            for (var i = 0; i < numOfRotations * 2; i++) {
                for (var j = -2; j <= 2; j++) {
               
                }
                
                p.stroke(colour);
                //call the function as detemined by the variable shape
                //rect and ellipse are built in p5.js
                //tri,hexa & octa are defined in this file
                p.rect(0, 20, shapeSize, shapeSize);
                p.rotate(p.PI / numOfRotations);
            
            }
            p.translate(-canvasX, -p.height / 2);
        };
        
        /*
        * function to draw an equilateral triangle with a set width
        * based on x, y co-oridinates that are the center of the triangle
        * @param {Number} x        - x-coordinate that is at the center of triangle
        * @param {Number} y      	- y-coordinate that is at the center of triangle
        * @param {Number} width    - radius of the hexagon
        */
        p.equilateral = (x, y, width) => {
            const x1 = x - (width/2);
            const y1 = y + width / 2;
            const x2 = x;
            const y2 = y - width / 2;
            const x3 = x + width / 2;
            const y3 = y + width / 2;
            p.triangle(x1,y1,x2,y2,x3,y3);
        }


        p.updateCanvasDimensions = () => {
            p.canvasWidth = window.innerWidth;
            p.canvasHeight = window.innerHeight;
            p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.redraw();
        }

        if (window.attachEvent) {
            window.attachEvent(
                'onresize',
                function () {
                    p.updateCanvasDimensions();
                }
            );
        }
        else if (window.addEventListener) {
            window.addEventListener(
                'resize',
                function () {
                    p.updateCanvasDimensions();
                },
                true
            );
        }
        else {
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
