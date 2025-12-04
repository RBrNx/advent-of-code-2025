import logger from '../logger.ts';

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

        logger.log(`Checking next batter: ${nextBattery}`);

        if (nextBattery > highestSecondDigit) {
          logger.log(`New highest second digit found: ${nextBattery}`);
          highestSecondDigit = nextBattery;
        }
      }
    }
  }

  return `${highestFirstDigit}${highestSecondDigit}`;
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

const partTwo = (input: string[]) => {};

const solve = (input: string[], part: number) => (part === 1 ? partOne(input) : partTwo(input));

const expected = (part: number) => (part === 1 ? 17346 : 0);

export { solve, expected };
