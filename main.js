import {createGraph} from './createGraph.js';
import {createTextAreaForMatrix, createDirectedMatrix, createTextArea, writeMatrixInTextArea, makeMatrixUndirected
} from './createTextArea.js';
import {
    createCondensationMatrix,
    degreesOfVertexesInDirectedGraph,
    degreesOfVertexesInUndirectedGraph,
    getComponentsOfStrongConnectivity,
    getHandingVertexes,
    getIsolatedVertexes,
    getMatrixOfStrongConnectivity,
    getPaths,
    halfDegreesOfEntry,
    halfDegreesOfOutput,
    regularDirected,
    regularUndirected,
    getAllCompositions,
    getReachabilityMatrix,
} from './analyseFunctions.js'
import {countOfVertexes, radiusOfCircleOfVertexes, distanceFromTopToFirstGraphs, distanceFromTopToFirstTextAreas, k1,
k2} from './data.js'

const firstDirectedMatrix = createDirectedMatrix(k1, countOfVertexes);
createTextAreaForMatrix(window.innerWidth * 3 / 8,
    distanceFromTopToFirstTextAreas + radiusOfCircleOfVertexes * 2, firstDirectedMatrix);

const firstUndirectedMatrix = makeMatrixUndirected(firstDirectedMatrix);
createTextAreaForMatrix(window.innerWidth / 8,
    distanceFromTopToFirstTextAreas + radiusOfCircleOfVertexes * 2, firstUndirectedMatrix);

createGraph(countOfVertexes, radiusOfCircleOfVertexes, firstUndirectedMatrix, window.innerWidth / 8,
    distanceFromTopToFirstGraphs, false)

createGraph(countOfVertexes, radiusOfCircleOfVertexes, firstDirectedMatrix, window.innerWidth * 3 / 8,
    distanceFromTopToFirstGraphs, true)

const firstGraphsAnalyse = createTextArea(1200, 40, 24, 60);
degreesOfVertexesInUndirectedGraph(firstUndirectedMatrix, firstGraphsAnalyse);
degreesOfVertexesInDirectedGraph(firstDirectedMatrix, firstGraphsAnalyse);
halfDegreesOfOutput(firstDirectedMatrix, firstGraphsAnalyse);
halfDegreesOfEntry(firstDirectedMatrix, firstGraphsAnalyse);
firstGraphsAnalyse.textContent += 'Regularity:\n';
firstGraphsAnalyse.textContent +=
    `Undirected graph is ${regularUndirected(firstUndirectedMatrix) ? 'regular' : 'irregular'}\n`;
firstGraphsAnalyse.textContent +=
    `Directed graph is ${regularDirected(firstDirectedMatrix) ? 'regular' : 'irregular'}\n\n`;

const incrementArray = (array) => {
    const newArray = []
    for(let i = 0; i < array.length; i++) {
        newArray[i] = array[i] + 1;
    }
    return newArray;
}

const isolatedVertexes = incrementArray(getIsolatedVertexes(firstUndirectedMatrix));

firstGraphsAnalyse.textContent += isolatedVertexes.length ? `List of isolated vertexes: ${isolatedVertexes}\n`:
    'Graphs haven`t isolated vertexes\n';

const handingVertexes = incrementArray(getHandingVertexes(firstUndirectedMatrix))
firstGraphsAnalyse.textContent += handingVertexes.length ? `Handing vertexes: ${handingVertexes}` :
    'Graphs haven`t handing vertexes';

const secondDirectedMatrix = createDirectedMatrix(k2, countOfVertexes);
createGraph(countOfVertexes, radiusOfCircleOfVertexes, secondDirectedMatrix,
    window.innerWidth/4, 900, true)
createTextAreaForMatrix(window.innerWidth/4, 1300, secondDirectedMatrix);

const secondGraphAnalyse = createTextArea(1100, 940, 20, 80);
halfDegreesOfOutput(secondDirectedMatrix, secondGraphAnalyse);
halfDegreesOfEntry(secondDirectedMatrix, secondGraphAnalyse);

getPaths(secondGraphAnalyse, secondDirectedMatrix, 2, 7);
getPaths(secondGraphAnalyse, secondDirectedMatrix, 3, 5);

const allCompositions = getAllCompositions(secondDirectedMatrix);
const reachabilityMatrix = getReachabilityMatrix(allCompositions);
secondGraphAnalyse.textContent+='\nReachability matrix:\n'
writeMatrixInTextArea(secondGraphAnalyse, reachabilityMatrix)

const matrixOfStrongConnectivity = getMatrixOfStrongConnectivity(reachabilityMatrix);
secondGraphAnalyse.textContent+='\n\nMatrix of strong connectivity:\n';
writeMatrixInTextArea(secondGraphAnalyse, matrixOfStrongConnectivity);

const componentsOfStrongConnectivity = getComponentsOfStrongConnectivity(matrixOfStrongConnectivity);

secondGraphAnalyse.textContent+= `\n\nComponents of strong connectivity:\n`;
for(let i = 0; i < componentsOfStrongConnectivity.length; i++) {
    const component = incrementArray(componentsOfStrongConnectivity[i]);
    secondGraphAnalyse.textContent += `${i+1}. [${component}]\n`;
}

const condensationMatrix  = createCondensationMatrix(componentsOfStrongConnectivity, secondDirectedMatrix);
secondGraphAnalyse.textContent += '\nCondensation matrix:\n'
writeMatrixInTextArea(secondGraphAnalyse, condensationMatrix);
createGraph(condensationMatrix.length, radiusOfCircleOfVertexes*2/3, condensationMatrix,
    window.innerWidth*3/4, 1500, true);

// console.log(getAllCompositions([[0, 1, 0],[1, 0, 1],[0, 0, 0]]))
//
//
// console.log(getReachabilityMatrix(getAllCompositions(secondDirectedMatrix)));
