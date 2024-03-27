const k1 = 0.69;
const k2 = 0.725;
const seedRandom = new Math.seedrandom(3401);
const textAreaFontSize = 20;
const h = 2;
const vertexRadius = 14;
const extraAngle = 0.18;
const vertexSize = 24;

const lineWidth = 1;
const arrowWidth = 5;
const arrowLengthInLine = 16;
const arrowLengthInEllipse = 16;
const countOfVertexes = 10;
const radiusOfCircleOfVertexes = 150
const distanceBetweenLinesInDirectedGraph = 8;
const distanceFromTopToFirstGraphs = 90;
const distanceFromTopToFirstTextAreas = 190
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.style.position = 'absolute';
canvas.style.top='0px';
canvas.style.left='0px';
canvas.width = window.innerWidth;
canvas.height = 2*window.innerHeight;
canvas.id = 'canvas';
const ctx = canvas.getContext('2d');

export {lineWidth, ctx, k1, k2, arrowWidth, h, arrowLengthInEllipse, arrowLengthInLine, canvas, countOfVertexes,
    distanceBetweenLinesInDirectedGraph, distanceFromTopToFirstGraphs, distanceFromTopToFirstTextAreas, extraAngle,
    radiusOfCircleOfVertexes, seedRandom, textAreaFontSize, vertexRadius, vertexSize }
