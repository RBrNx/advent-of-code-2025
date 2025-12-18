const partOne = (input: string[]) => {
  const grid = input.map(line => line.split(''));

  let currentRow = 0;
  let numberOfSplits = 0;

  while (currentRow < grid.length - 1) {
    if (currentRow === 0) {
      const startColumn = grid[currentRow].indexOf('S');
      grid[currentRow + 1][startColumn] = '|';
      currentRow++;
    } else {
      // Manually loop through each character in the current row
      for (let currentColumn = 0; currentColumn < grid[currentRow].length - 1; currentColumn++) {
        const currRowCell = grid[currentRow][currentColumn];
        const nextRowCell = grid[currentRow + 1][currentColumn];

        // We can ignore empty space characters (.)
        if (currRowCell === '.') {
          continue;
        } else if (currRowCell === '|') {
          // If we've found a beam and the cell directly underneath is a splitter, then we split the beam
          if (nextRowCell === '^') {
            grid[currentRow + 1][currentColumn - 1] = '|';
            grid[currentRow + 1][currentColumn + 1] = '|';
            numberOfSplits++;
          } else {
            // Else we just keep moving the beam down
            grid[currentRow + 1][currentColumn] = '|';
          }
        }
      }

      currentRow++;
    }
  }

  return numberOfSplits;
};

const getNonEmptyIndexes = (array: string[]): number[] => {
  const indexes = [];

  for (let i = 0; i < array.length; i++) {
    if (array[i] !== '.') {
      indexes.push(i);
    }
  }

  return indexes;
};

const followPath = (node: Node | null, visitedNodes: Map<string, number>): number => {
  if (!node) return 0;

  // Check if we've already visited this node
  // if so we can simply return the timeline count we've already calculated in the past
  if (visitedNodes.has(node.toString())) {
    return visitedNodes.get(node.toString())!;
  }

  let intermediateTimelineCount = 0;

  // If we've not got a left child then we can consider the beam has reached the end
  if (!node.left) {
    intermediateTimelineCount++;
  }

  // Same for right child
  if (!node.right) {
    intermediateTimelineCount++;
  }

  // Continue to follow the left/right paths
  intermediateTimelineCount += followPath(node.left, visitedNodes);
  intermediateTimelineCount += followPath(node.right, visitedNodes);

  // We've now calculated the total timeline counts you can reach from this current node
  // So lets store that for future in case we reach this node again
  visitedNodes.set(node.toString(), intermediateTimelineCount);

  return intermediateTimelineCount;
};

class Node {
  position: [number, number] = [0, 0];
  index: number = 0;
  left: Node | null = null;
  right: Node | null = null;

  constructor(position: [number, number], index: number) {
    this.position = position;
    this.index = index;
  }

  toString() {
    return `[${this.position[0]}, ${this.position[1]}]`;
  }
}

const partTwo = (input: string[]) => {
  const nodes = [];

  // Convert input into an array of individual nodes with x, y coordinates
  for (const [rowIndex, line] of input.entries()) {
    if (rowIndex < 2) {
      continue;
    }

    const indexesToProcess = getNonEmptyIndexes(line.split(''));

    for (const columnIndex of indexesToProcess) {
      const node = new Node([rowIndex, columnIndex], nodes.length + 1);
      nodes.push(node);
    }
  }

  // Loop through all nodes, attaching child nodes to parent ones based on their locations
  for (const node of nodes) {
    const [row, col] = node.position;

    const leftNode = nodes.find(n => n.position[0] > row && n.position[1] === col - 1);
    const rightNode = nodes.find(n => n.position[0] > row && n.position[1] === col + 1);

    node.left = leftNode || null;
    node.right = rightNode || null;
  }

  const visitedNodes = new Map<string, number>();

  // Start following the possible paths from the root node
  const numberOfTimelines = followPath(nodes[0], visitedNodes);

  return numberOfTimelines;
};

const solve = (input: string[], part: number) => (part === 1 ? partOne(input) : partTwo(input));

const expected = (part: number) => (part === 1 ? 0 : 0);

export { solve, expected };
