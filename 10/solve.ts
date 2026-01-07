type Machine = {
  lights: string;
  buttons: number[][];
  joltageRequired: string;
};

const generateCombinations = <T>(items: T[], comboLength: number, prefix: T[] = []): Array<T[]> => {
  if (comboLength == 0) return [prefix];
  return items.flatMap((v, i) => generateCombinations(items.slice(i + 1), comboLength - 1, [...prefix, v]));
};

const simulateButtonPresses = (machine: Machine, buttonsToPress: number[][]): string => {
  const lightsArray = machine.lights
    .slice(1, -1)
    .split('')
    .map(() => '.');

  for (const button of buttonsToPress) {
    for (const lightIndex of button) {
      lightsArray[lightIndex] = lightsArray[lightIndex] === '#' ? '.' : '#';
    }
  }

  return `[${lightsArray.join('')}]`;
};

const partOne = (input: string[]) => {
  const machines = input.map(line => {
    const [_, lights, buttonsStr, joltageRequired] = /(\[[.#]+\])\s(.+)\s({[\d,]+})/.exec(line) || [];
    const buttons = buttonsStr
      .split(' ')
      .map((btn: string) => btn.replaceAll('(', '').replaceAll(')', '').split(',').map(Number));
    return { lights, buttons, joltageRequired } as Machine;
  });

  let totalButtonPresses = 0;

  for (const [index, machine] of machines.entries()) {
    let countFound = false;
    let comboSize = 1;
    let workingCombo = null;

    while (!countFound) {
      const buttonCombos = generateCombinations(machine.buttons, comboSize);
      for (const combo of buttonCombos) {
        // Simulate pressing buttons in combo
        const result = simulateButtonPresses(machine, combo);
        if (result === machine.lights) {
          countFound = true;
          workingCombo = combo;
          break;
        }
      }

      if (comboSize > machine.buttons.length) {
        console.warn('Exceeded button combinations without finding a solution');
        break;
      }

      if (!countFound) {
        comboSize++;
      }
    }

    console.log(
      `Found combo for machine (${index + 1}/${machines.length}) ${machine.lights}:`,
      workingCombo,
      comboSize,
    );

    if (countFound) {
      totalButtonPresses += comboSize;
    }
  }

  return totalButtonPresses;
};

const partTwo = (input: string[]) => {};

const solve = (input: string[], part: number) => (part === 1 ? partOne(input) : partTwo(input));

const expected = (part: number) => (part === 1 ? 0 : 0);

export { solve, expected };
