type Coordinates = [number, number, number];
type JunctionBox = {
  location: Coordinates;
  id: number;
};
type JunctionPairs = {
  pair: [JunctionBox, JunctionBox];
  distance: number;
};
type Circuit = number[];

const calculateStraightLineDistance = (a: Coordinates, b: Coordinates) => {
  const x = Math.pow(a[0] - b[0], 2);
  const y = Math.pow(a[1] - b[1], 2);
  const z = Math.pow(a[2] - b[2], 2);

  return Math.sqrt(x + y + z);
};

const generateCombinations = <T>(items: T[], comboLength: number, prefix: T[] = []): Array<T[]> => {
  if (comboLength == 0) return [prefix];
  return items.flatMap((v, i) => generateCombinations(items.slice(i + 1), comboLength - 1, [...prefix, v]));
};

const partOne = (input: string[]) => {
  const junctionBoxes: JunctionBox[] = [];
  const boxPairs: JunctionPairs[] = [];
  const circuits: Circuit[] = [];

  for (const [index, line] of input.entries()) {
    const [x, y, z] = line.split(',').map(Number);
    junctionBoxes.push({ location: [x, y, z], id: index });
  }

  const junctionBoxCombinations = generateCombinations(junctionBoxes, 2);

  for (const combo of junctionBoxCombinations) {
    const distance = calculateStraightLineDistance(combo[0].location, combo[1].location);

    boxPairs.push({ pair: [combo[0], combo[1]], distance });
  }
  boxPairs.sort((a, b) => a.distance - b.distance);

  let connectionsToMake = 1000;
  while (connectionsToMake > 0) {
    const { pair } = boxPairs.shift()!;

    const firstItemCircuitIndex = circuits.findIndex(circuit => circuit.includes(pair[0].id));
    const secondItemCircuitIndex = circuits.findIndex(circuit => circuit.includes(pair[1].id));
    if (firstItemCircuitIndex > -1 && secondItemCircuitIndex === -1) {
      // First item already exists in a circuit, so lets add the second item to the same circuit
      circuits[firstItemCircuitIndex].push(pair[1].id);
      connectionsToMake--;
    } else if (secondItemCircuitIndex > -1 && firstItemCircuitIndex === -1) {
      // Second item already exists in a circuit, so lets add the second item to the same circuit
      circuits[secondItemCircuitIndex].push(pair[0].id);
      connectionsToMake--;
    } else if (firstItemCircuitIndex === -1 && secondItemCircuitIndex === -1) {
      // Neither of the items currently exist in a circuit, so lets add a new one
      circuits.push([pair[0].id, pair[1].id]);
      connectionsToMake--;
    } else if (
      firstItemCircuitIndex > -1 &&
      secondItemCircuitIndex > -1 &&
      firstItemCircuitIndex !== secondItemCircuitIndex
    ) {
      // Both items already exist but in different circuits, so we join those circuits together
      circuits[firstItemCircuitIndex].push(...circuits[secondItemCircuitIndex]);
      circuits.splice(secondItemCircuitIndex, 1);
      connectionsToMake--;
    } else {
      // Both items already exist within the same circuit, so we do nothing (but it still counts as a connection)
      connectionsToMake--;
    }
  }

  circuits.sort((a, b) => b.length - a.length);

  return circuits[0].length * circuits[1].length * circuits[2].length;
};

const partTwo = (input: string[]) => {
  let junctionBoxes: JunctionBox[] = [];
  const boxPairs: JunctionPairs[] = [];
  const circuits: Circuit[] = [];

  for (const [index, line] of input.entries()) {
    const [x, y, z] = line.split(',').map(Number);
    junctionBoxes.push({ location: [x, y, z], id: index });
  }

  const junctionBoxCombinations = generateCombinations(junctionBoxes, 2);

  for (const combo of junctionBoxCombinations) {
    const distance = calculateStraightLineDistance(combo[0].location, combo[1].location);

    boxPairs.push({ pair: [combo[0], combo[1]], distance });
  }
  boxPairs.sort((a, b) => a.distance - b.distance);

  let lastPair = boxPairs[0].pair;
  while (junctionBoxes.length) {
    const { pair } = boxPairs.shift()!;

    const firstItemCircuitIndex = circuits.findIndex(circuit => circuit.includes(pair[0].id));
    const secondItemCircuitIndex = circuits.findIndex(circuit => circuit.includes(pair[1].id));
    if (firstItemCircuitIndex > -1 && secondItemCircuitIndex === -1) {
      // First item already exists in a circuit, so lets add the second item to the same circuit
      circuits[firstItemCircuitIndex].push(pair[1].id);
      junctionBoxes = junctionBoxes.filter(jb => jb.id !== pair[1].id);
      lastPair = pair;
    } else if (secondItemCircuitIndex > -1 && firstItemCircuitIndex === -1) {
      // Second item already exists in a circuit, so lets add the second item to the same circuit
      circuits[secondItemCircuitIndex].push(pair[0].id);
      junctionBoxes = junctionBoxes.filter(jb => jb.id !== pair[0].id);
      lastPair = pair;
    } else if (firstItemCircuitIndex === -1 && secondItemCircuitIndex === -1) {
      // Neither of the items currently exist in a circuit, so lets add a new one
      circuits.push([pair[0].id, pair[1].id]);
      junctionBoxes = junctionBoxes.filter(jb => jb.id !== pair[1].id && jb.id !== pair[0].id);
      lastPair = pair;
    } else if (
      firstItemCircuitIndex > -1 &&
      secondItemCircuitIndex > -1 &&
      firstItemCircuitIndex !== secondItemCircuitIndex
    ) {
      // Both items already exist but in different circuits, so we join those circuits together
      circuits[firstItemCircuitIndex].push(...circuits[secondItemCircuitIndex]);
      circuits.splice(secondItemCircuitIndex, 1);
      lastPair = pair;
    }
  }

  return lastPair[0].location[0] * lastPair[1].location[0];
};

const solve = (input: string[], part: number) => (part === 1 ? partOne(input) : partTwo(input));

const expected = (part: number) => (part === 1 ? 57970 : 8520040659);

export { solve, expected };
