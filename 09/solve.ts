type Coordinate = [number, number];
import { Canvas, createCanvas } from 'canvas';
import isPointInPolygon from 'robust-point-in-polygon';
import fs from 'node:fs';

const generateCombinations = <T>(items: T[], comboLength: number, prefix: T[] = []): Array<T[]> => {
  if (comboLength == 0) return [prefix];
  return items.flatMap((v, i) => generateCombinations(items.slice(i + 1), comboLength - 1, [...prefix, v]));
};

const calculateArea = (topLeft: Coordinate, topRight: Coordinate, bottomRight: Coordinate, bottomLeft: Coordinate) => {
  const width = Math.abs(topLeft[0] - topRight[0]) + 1;
  const height = Math.abs(topLeft[1] - bottomRight[1]) + 1;

  const altWidth = Math.abs(bottomLeft[0] - bottomRight[0]) + 1;
  const altHeight = Math.abs(topRight[1] - bottomLeft[1]) + 1;

  if (altWidth !== width || altHeight !== height) {
    throw new Error('Mismatched width/height');
  }

  return width * height;
};

const partOne = (input: string[]) => {
  // Convert input to coordinates and generate all combinations of 2 coordinates
  const tileCoordinates: Coordinate[] = input.map(line => line.split(',').map(Number) as Coordinate);
  const coordinateCombinations = generateCombinations(tileCoordinates, 2);

  let largestArea = 0;

  // For each combo of coordinates, create a bounding box and calculate the area
  for (const combo of coordinateCombinations) {
    const [x1, y1] = combo[0];
    const [x2, y2] = combo[1];

    const box: Coordinate[] = [];
    const xMin = Math.min(x1, x2);
    const xMax = Math.max(x1, x2);
    const yMin = Math.min(y1, y2);
    const yMax = Math.max(y1, y2);

    box.push([xMin, yMin], [xMax, yMin], [xMax, yMax], [xMin, yMax]);

    const area = calculateArea(box[0], box[1], box[2], box[3]);

    if (area > largestArea) {
      largestArea = area;
    }
  }

  return largestArea;
};

let canvas: Canvas | null = null;
const getCanvas = (width: number, height: number): Canvas => {
  if (!canvas) {
    canvas = createCanvas(width, height);
  } else {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
  }

  return canvas;
};

const drawToCanvas = (
  coordinates: Coordinate[],
  box: Coordinate[],
  invalidCoord: Coordinate | null,
  index: number,
  area: number,
  isLargestArea: boolean,
) => {
  // Avoid spending time drawing small areas
  if (area < 1000000) {
    return;
  }

  // Scale down coordinates for canvas otherwise it gets too large (adding 1000px for visual padding)
  const maxX = Math.max(...coordinates.map(coord => coord[0])) + 1000;
  const maxY = Math.max(...coordinates.map(coord => coord[1])) + 1000;

  const canvas = getCanvas(maxX / 10, maxY / 10);
  const ctx = canvas.getContext('2d');

  // Add some text info to the canvas
  if (invalidCoord) {
    ctx.font = '30px Impact';
    ctx.fillStyle = 'rgba(255,0,0,1)';
    ctx.fillText(`Invalid Coord: [${invalidCoord[0]}, ${invalidCoord[1]}]`, 50, 200);
  }

  ctx.font = '30px Impact';
  ctx.fillStyle = isLargestArea ? 'rgba(0,255,0,1)' : 'rgba(255,0,0,1)';
  ctx.fillText(`Area: ${area}`, 50, 250);

  // Draw path of all coordinates, filling in the shape
  ctx.beginPath();
  for (const coord of coordinates) {
    const x = coord[0] / 10;
    const y = coord[1] / 10;

    ctx.strokeStyle = 'rgba(0,0,0,1)';

    ctx.lineTo(x, y);
    ctx.stroke();
  }

  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.closePath();
  ctx.fill();

  // Draw each coordinate as a red dot on the canvas
  for (const coord of coordinates) {
    const x = coord[0] / 10;
    const y = coord[1] / 10;

    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,0,0,1)';
    ctx.fillStyle = 'rgba(255,0,0,0.3)';
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }

  // Draw the bounding box on the canvas
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255,0,0,1)';
  ctx.fillStyle = 'rgba(255,0,0,0.3)';
  for (const coord of box) {
    const x = coord[0] / 10;
    const y = coord[1] / 10;

    ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.fill();
  ctx.closePath();

  // If there is an invalid coordinate, draw it as a purple dot
  if (invalidCoord) {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,0,255,1)';
    ctx.fillStyle = 'rgba(255,0,255,0.3)';
    ctx.arc(invalidCoord[0] / 10, invalidCoord[1] / 10, 4, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }

  // Output the canvas to a PNG file
  const buffer = canvas.toBuffer();
  const filenameAppend = `${invalidCoord ? '-invalid' : isLargestArea ? '-largest' : ''}`;
  fs.writeFileSync(`${process.cwd()}/09/outputs/floor-${index}${filenameAppend}.png`, buffer);
};

const partTwo = (input: string[]) => {
  fs.rmSync(`${process.cwd()}/09/outputs`, { recursive: true });
  fs.mkdirSync(`${process.cwd()}/09/outputs`);

  // Convert input to coordinates and generate all combinations of 2 coordinates
  const tileCoordinates: Coordinate[] = input.map(line => line.split(',').map(Number) as Coordinate);
  const coordinateCombinations = generateCombinations(tileCoordinates, 2);

  let largestArea = 0;

  // For each combo of coordinates, create a bounding box and calculate the area - this time we have to check if the bounding box is entirely inside the polygon
  mainLoop: for (const [index, combo] of coordinateCombinations.entries()) {
    const [x1, y1] = combo[0];
    const [x2, y2] = combo[1];

    const box: Coordinate[] = [];
    const xMin = Math.min(x1, x2);
    const xMax = Math.max(x1, x2);
    const yMin = Math.min(y1, y2);
    const yMax = Math.max(y1, y2);

    box.push([xMin, yMin], [xMax, yMin], [xMax, yMax], [xMin, yMax]);

    // Check all four corners of the box to see if they are valid (within the polygon)
    for (const corner of box) {
      // Return 0 if point is on the border, return -1 if inside, else return 1
      const isCornerValid = isPointInPolygon(tileCoordinates, corner);
      if (isCornerValid === 1) {
        continue mainLoop;
      }
    }

    // Calculate area of the box, if it's not larger than the largestArea found so far, skip further checks
    const area = calculateArea(box[0], box[1], box[2], box[3]);

    if (area < largestArea) {
      continue;
    }

    // Now check all points (every 100px) along the edges of the box to ensure they are all valid (within the polygon)
    let invalidCoord: Coordinate | null = null;
    for (let i = 0; i < 4; i++) {
      const startCoord = box[i];
      const endCoord = box[(i + 1) % 4];

      const deltaX = endCoord[0] - startCoord[0];
      const deltaY = endCoord[1] - startCoord[1];

      if (deltaX === 0) {
        // Vertical line
        let currentY = Math.min(startCoord[1], endCoord[1]) + 100;
        while (currentY < Math.max(startCoord[1], endCoord[1])) {
          const isPointInBox = isPointInPolygon(tileCoordinates, [startCoord[0], currentY]);
          if (isPointInBox === 1) {
            invalidCoord = [startCoord[0], currentY];
            break;
          }
          currentY += 100;
        }
      } else if (deltaY === 0) {
        let currentX = Math.min(startCoord[0], endCoord[0]) + 100;
        while (currentX < Math.max(startCoord[0], endCoord[0])) {
          const isPointInBox = isPointInPolygon(tileCoordinates, [currentX, startCoord[1]]);
          if (isPointInBox === 1) {
            invalidCoord = [currentX, startCoord[1]];
            break;
          }
          currentX += 100;
        }
      }
    }

    // We only consider updating largestArea if we didn't find an invalid coordinate
    const isLargestArea = area > largestArea && invalidCoord === null;

    if (area > largestArea) {
      if (invalidCoord === null) {
        largestArea = area;
      }
    }

    // Draw the current box and polygon to a canvas for visualization
    drawToCanvas(tileCoordinates, box, invalidCoord, index, area, isLargestArea);
  }

  return largestArea;
};

const solve = (input: string[], part: number) => (part === 1 ? partOne(input) : partTwo(input));

const expected = (part: number) => (part === 1 ? 4759531084 : 1539238860);

export { solve, expected };
