import logger from '../logger.ts';

// Naive way of calculating joltage from a bank of batteries, requires nested loops so isn't feasible for larger amounts of batteries
const calculateJoltage = (batteryBank: string) => {
  const batteries = batteryBank.split('').map(num => parseInt(num));

  let highestFirstDigit = 0;
  let highestSecondDigit = 0;

  logger.log('STARTING NEW BATTERY BANK CALCULATION', batteries);

  for (let i = 0; i < batteries.length - 1; i++) {
    const battery = batteries[i];

    if (battery > highestFirstDigit) {
      highestFirstDigit = battery;
      highestSecondDigit = 0;

      logger.log(`New highest first digit found: ${highestFirstDigit}`);

      for (let j = i + 1; j < batteries.length; j++) {
        const nextBattery = batteries[j];

        logger.log(`Checking next battery: ${nextBattery}`);

        if (nextBattery > highestSecondDigit) {
          logger.log(`New highest second digit found: ${nextBattery}`);
          highestSecondDigit = nextBattery;
        }
      }
    }
  }

  return `${highestFirstDigit}${highestSecondDigit}`;
};

// Recursive way of calculating joltage from a bank of batteries, more efficient for larger amounts of batteries
const calculateJoltageRecursively = (
  batteryBank: string,
  highestBatteries: string,
  lengthRequired: number,
  previousMaxChecked?: number,
): string => {
  const batteries = batteryBank.split('').map(num => parseInt(num));
  const maxBattery = previousMaxChecked
    ? Math.max(...batteries.filter(battery => battery < previousMaxChecked))
    : Math.max(...batteries);

  // Early exit if we've found the required length of batteries
  if (highestBatteries.length === lengthRequired) {
    return highestBatteries;
  }

  logger.log(
    `Calculating joltage recursively. Current highest batteries: ${highestBatteries}, length required: ${lengthRequired}, batteries: ${batteries}`,
  );

  // Find all indexes of the max battery
  const indexes = (() => {
    const _ = [];

    for (let i = 0; i < batteries.length; i++) {
      if (batteries[i] === maxBattery) {
        _.push(i);
      }
    }

    return _;
  })();

  // For each index, try to build the highest batteries string
  for (const index of indexes) {
    let interimHighestBatteries = highestBatteries;
    const remainingBatteries = batteries.slice(index + 1);

    // Early exit if not enough batteries remain to reach required length
    if (remainingBatteries.length < lengthRequired - interimHighestBatteries.length - 1) {
      continue;
    }

    interimHighestBatteries += batteries[index];

    const value = calculateJoltageRecursively(remainingBatteries.join(''), interimHighestBatteries, lengthRequired);

    if (value.length === lengthRequired) {
      logger.log(`Found highest batteries: ${interimHighestBatteries}`);
      return value;
    }
  }

  // We've failed to find a valid combination using the current max battery, so try again with the next highest battery
  return calculateJoltageRecursively(batteryBank, highestBatteries, lengthRequired, maxBattery);
};

const partOne = (input: string[]) => {
  let totalJoltage = 0;

  for (const batteryBank of input) {
    const joltage = calculateJoltage(batteryBank);

    logger.log(`Battery bank '${batteryBank}' has joltage ${joltage}`);

    totalJoltage += parseInt(joltage);
  }

  return totalJoltage;
};

const partTwo = (input: string[]) => {
  let totalJoltage = 0;
  const lengthRequired = 12;

  for (const batteryBank of input) {
    const joltage = calculateJoltageRecursively(batteryBank, '', lengthRequired);

    logger.logGreen(`Battery bank '${batteryBank}' has joltage ${joltage}`);

    totalJoltage += parseInt(joltage);
  }

  return totalJoltage;
};

const solve = (input: string[], part: number) => (part === 1 ? partOne(input) : partTwo(input));

const expected = (part: number) => (part === 1 ? 17346 : 172981362045136);

export { solve, expected };
