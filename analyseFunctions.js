const countDegreesOfVertices = (matrix, textArea, degreeOrHalfDegree, textOnTop, callback) => {
    textArea.textContent += `${textOnTop}\n`;
    const matrixSize = matrix.length;
    const textVertex = 'vertex: ';
    textArea.textContent += textVertex;
    textArea.textContent += ' '.repeat(degreeOrHalfDegree.length+2 - textVertex.length);
    for(let row = 0; row < matrixSize; row++) {
        textArea.textContent += `${row+1}  `;
    }
    textArea.textContent += `\n${degreeOrHalfDegree}: `;
    const degrees = [];
    degrees.length = matrixSize;
    degrees.fill(0);
    for(let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            degrees[row] += callback(row, column);
        }
        textArea.textContent += `${degrees[row]}  `
    }
    textArea.textContent += '\n\n'
    return degrees;
}
const degreesOfVertexesInUndirectedGraph = (matrix, textArea) =>
    countDegreesOfVertices(matrix, textArea, 'degreeOutput',
        'degrees of vertexes in undirected graph:', (row, column) => {
            let adder = 0;
            if(matrix[row][column]) {
                adder++;
                if(row === column) adder++;
            }
            return adder;
        })

const degreesOfVertexesInDirectedGraph = (matrix, textArea) =>
    countDegreesOfVertices(matrix, textArea, 'degreeOutput',
        'degrees of vertexes in directed graph:', (row, column) => {
            let adder = 0;
            if (matrix[row][column]) adder++;
            if (matrix[column][row]) adder++;
            return adder;
        })


const halfDegreesOfOutput = (matrix, textArea) =>
    countDegreesOfVertices(matrix, textArea, 'output half-degree',
        'half-degree of output of directed graph:', (row, column) => matrix[row][column]);


const halfDegreesOfEntry = (matrix, textArea) =>
    countDegreesOfVertices(matrix, textArea, 'entry half-degree',
        'half-degree of entry of directed graph:', (row, column) => matrix[column][row]);

const regularUndirected = (matrix) => {
    const matrixSize = matrix.length;
    let degree = -1;
    for(let row = 0; row < matrixSize; row++) {
        let currentDegree = 0;
        for(let column = 0; column < matrixSize; column++) {
            if(matrix[row][column]) currentDegree++;
        }
        if(degree < 0) degree = currentDegree;
        else if(degree !== currentDegree) return false;
    }
    return true;
}

const regularDirected = (matrix) => {
    const matrixSize = matrix.length;
    let degreeOutput = -1;
    let degreeEntry = -1;
    for(let row = 0; row < matrixSize; row++) {
        let currentDegreeOutput = 0;
        let currentDegreeEntry = 0;
        for(let column = 0; column < matrixSize; column++) {
            if(matrix[row][column]) currentDegreeOutput++;
            if(matrix[column][row]) currentDegreeEntry++;
        }
        if(degreeOutput < 0) degreeOutput = currentDegreeOutput;
        else if(degreeOutput !== currentDegreeOutput) return false;
        if(degreeEntry < 0) degreeEntry = currentDegreeEntry;
        else if(degreeEntry !== currentDegreeEntry) return false;
    }
    return true;
}

const getIsolatedVertexes = (matrix) => {
    const matrixSize = matrix.length;
    const isolatedVertexes = [];
    for(let row = 0; row < matrixSize; row++) {
        let isolated = true
        for(let column = 0; column < matrixSize; column++) {
            if(matrix[row][column]) {
                isolated = false;
                break;
            }
        }
        if(isolated) isolatedVertexes.push(row);
    }
    return isolatedVertexes;
}

const getHandingVertexes = (matrix) => {
    const handingVertexes = [];
    const matrixSize = matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        let handing = false;
        for (let column = 0; column < matrixSize; column++) {
            if (matrix[row][column] || matrix[column][row]) {
                if (handing) {
                    handing = false;
                    break;
                }
                handing = true
            }
        }
        if (handing) handingVertexes.push(row);
    }
    return handingVertexes;
}

const createMatrixOfZeros = (length) => {
    let matrix = [];
    for (let i = 0; i < length; i++) {
        matrix.push([]);
        for (let j = 0; j < length; j++) {
            matrix[i][j] = 0;
        }
    }
    return matrix;
}

const iterateMatrix = (matrix, callback) => {
    const matrixSize = matrix.length;
    for(let row = 0; row < matrixSize; row++){
        for(let column = 0; column < matrixSize; column++) {
            callback(row, column);
        }
    }
}
const getAllCompositions = (adjacencyMatrix) => {
    const matrixSize = adjacencyMatrix.length;
    let compositions = [null, adjacencyMatrix];
    for (let k = 2; k <= matrixSize; k++) {
        compositions[k] = createMatrixOfZeros(matrixSize);
        //console.log(compositions[k])
        for(let y = 0; y < matrixSize; y++){
            for (let row = 0; row < matrixSize; row++) {
                for (let column = 0; column < matrixSize; column++) {
                    compositions[k][row][column] = compositions[k][row][column]||
                        (compositions[1][row][y] && compositions[k-1][y][column]);
                    //if(row === column) reachabilityMatrix[row][column] = 1;
                }
            }
        }
    }
    return compositions
}

const getReachabilityMatrix = (compositions) =>{
    let oneCompositionSize;
    let reachabilityMatrix;
    for(const composition of compositions) {
        if (!composition) continue;
        if(!oneCompositionSize) {
            oneCompositionSize = composition.length;
            reachabilityMatrix = createMatrixOfZeros(oneCompositionSize)
        }
        iterateMatrix(composition, (row, column) => {
            reachabilityMatrix[row][column] = reachabilityMatrix[row][column] || composition[row][column];
        })
    }
    if(reachabilityMatrix) iterateMatrix(reachabilityMatrix, (row, column) => {
        if(row === column) reachabilityMatrix[row][column] = 1
    })
    return reachabilityMatrix
}

const findAllPaths = (matrix, length) => {
    const paths = [];

    const nextPaths = (vertex, path, currentLengthOfPath) => {
        if (currentLengthOfPath >= length) {
            paths.push([...path]);
            return;
        }

        for (let nextVertex = 0; nextVertex < matrix.length; nextVertex++) {
            if (matrix[vertex][nextVertex]) {
                path.push(nextVertex);
                nextPaths(nextVertex, path, currentLengthOfPath + 1);
                path.pop();
            }
        }
    }

    for (let vertex = 0; vertex < matrix.length; vertex++) {
        const path = [vertex];
        nextPaths(vertex, path, 0);
    }

    return paths;
}

const deletePathsWithRepeatingEdges = (paths) => {
    if(paths.length === 0 || paths[0].length < 2) return paths;
    const newPaths = [];
    for(const path of paths) {
        const edges = [];
        let uniqueEdge = true;
        for(let i = 0; i < path.length - 1; i++) {
            const currentEdge = [path[i], path[i+1]];
            for(const edge of edges) {
                if(equalArrays(edge, currentEdge)) {
                    uniqueEdge = false;
                    break;
                }
            }
            if(!uniqueEdge) break;
            edges.push(currentEdge);
        }
        if(uniqueEdge) newPaths.push(path);
    }
    return newPaths;
}

const writePaths = (textArea, paths, countOfPathsInRow) => {
    for(let path = 0; path < paths.length; path++) {
        textArea.textContent += '['
        for(let vertex = 0; vertex < paths[path].length;) {
            let number = ++paths[path][vertex];
            textArea.textContent += number > 9 ? '' : ' ';
            textArea.textContent += `${number}`;
            if(++vertex < paths[path].length) textArea.textContent += ',';
        }
        textArea.textContent += `]${(path+1) % countOfPathsInRow ? ' ' : '\n'}`;
    }
}

const getPaths = (textArea, matrix, lengthOfPath, countOfPathInRow) => {
    textArea.textContent += `\nAll paths with length of ${lengthOfPath}\n`;
    const allPaths = findAllPaths(matrix, lengthOfPath);
    const pathsWithoutRepeatingEdges = deletePathsWithRepeatingEdges(allPaths);
    writePaths(textArea, pathsWithoutRepeatingEdges, countOfPathInRow);
    textArea.textContent += '\n';
}

// const adjacencyToReachability = (adjacencyMatrix) => {
//     const numVertices = adjacencyMatrix.length;
//     let reachabilityMatrix = adjacencyMatrix.map(row => [...row]);
//
//     for (let k = 0; k < numVertices; k++) {
//         for (let i = 0; i < numVertices; i++) {
//             for (let j = 0; j < numVertices; j++) {
//                 reachabilityMatrix[i][j] = reachabilityMatrix[i][j] ||
//                     (reachabilityMatrix[i][k] && reachabilityMatrix[k][j]);
//                 if(i === j) reachabilityMatrix[i][j] = 1;
//             }
//         }
//     }
//
//     return reachabilityMatrix;
// }

const getMatrixOfStrongConnectivity = (reachabilityMatrix) => {
    const newMatrix = [];
    for(let row = 0; row < reachabilityMatrix.length; row++) {
        newMatrix[row] = [];
        for(let column = 0; column < reachabilityMatrix.length; column++) {
            newMatrix[row][column] = (reachabilityMatrix[row][column] && reachabilityMatrix[column][row]) ? 1 : 0;
        }
    }
    return newMatrix
}

const equalArrays = (array1, array2) => {
    for(let i = 0; i < array1.length; i++) {
        if(array1[i]!== array2[i]) return false;
    }
    return true;
}

const getComponentsOfStrongConnectivity = (matrixOfStrongConnectivity) => {
    const components = [];

    for(let row = 0; row < matrixOfStrongConnectivity.length; row++) {
        let thisComponentAlreadyExist = -1;
        for(let i = 0; i < components.length; i++) {
            if(equalArrays(components[i].component, matrixOfStrongConnectivity[row])) {
                thisComponentAlreadyExist = i;
            }
        }
        if(thisComponentAlreadyExist >= 0) components[thisComponentAlreadyExist].rows.push(row);
        else(components.push({
            component: matrixOfStrongConnectivity[row],
            rows: [row],
        }))
    }

    const result = [];
    for(const component of components) {
        result.push(component.rows);
    }
    return result;
}

function createCondensationMatrix(components, adjacencyMatrix) {
    const sizeOfNewMatrix= components.length;
    const newMatrix = [];
    for(let row = 0; row < sizeOfNewMatrix; row++) {
        newMatrix[row] = [];
        for(let column = 0; column < sizeOfNewMatrix; column++) {
            newMatrix[row][column] = 0;
        }
    }
    for(let firstComponent = 0; firstComponent < sizeOfNewMatrix; firstComponent++) {
        for(let secondComponent = 0; secondComponent < sizeOfNewMatrix; secondComponent++) {
            if(firstComponent === secondComponent) continue;
            for(const firstVertex of components[firstComponent]) {
                for(const secondVertex of components[secondComponent]) {
                    if(adjacencyMatrix[firstVertex][secondVertex]) {
                        newMatrix[firstComponent][secondComponent] = 1;
                        break;
                    }
                }
            }
        }
    }
    return newMatrix
}

export { countDegreesOfVertices, createCondensationMatrix, getMatrixOfStrongConnectivity,
    getComponentsOfStrongConnectivity, degreesOfVertexesInDirectedGraph, getAllCompositions, getReachabilityMatrix,
    degreesOfVertexesInUndirectedGraph, getHandingVertexes, getIsolatedVertexes, getPaths, writePaths,
    findAllPaths, deletePathsWithRepeatingEdges, halfDegreesOfEntry, halfDegreesOfOutput, regularDirected,
    regularUndirected }
