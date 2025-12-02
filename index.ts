import chalk from 'chalk';
import fs from 'node:fs';

/* eslint-disable no-unused-vars */
type Solver = {
  solve: (input: string[], part: number, enableLogs?: boolean) => string | number;
  expected: (part: number) => string | number;
};
/* eslint-enable no-unused-vars */

const ENABLE_LOGS = false;

let startDay = 1;
let endDay = 25;
const args = process.argv.slice(2);
for (const arg of args) {
  const n = Number(arg);
  if (n > 0) {
    startDay = n;
    endDay = n;
  }
}

const timed = (fn: () => string | number): [string | number, number] => {
  const start = process.hrtime();
  const output = fn();
  const [secs, nanosecs] = process.hrtime(start);
  const duration = secs * 1000 + Math.floor(nanosecs / 1000000);
  return [output, duration];
};

const printTestResult = (
  day: number,
  part: number,
  expected: string | number,
  actual: string | number,
  duration: number,
) => {
  const durationDesc = chalk.blue(`(${duration}ms)`);
  if (actual === expected) {
    console.log(chalk.green(`day ${day} part ${part}: ${actual} ${durationDesc}`));
  } else {
    console.log(chalk.red(`day ${day} part ${part}: ${actual} - expected ${expected} ${durationDesc}`));
  }
};

for (let day = startDay; day <= endDay; day += 1) {
  const path = `./${`0${day}`.slice(-2)}`;
  if (!fs.existsSync(path)) {
    console.log(chalk.red(`day ${day} not found`));
    break;
  }
  const solver: Solver = await import(`${path}/solve.ts`);

  const text = fs
    .readFileSync(`${path}/input.txt`)
    .toString()
    .split('\n')
    .map(s => s.replace(/\r$/, ''))
    .filter(s => s.length > 0);

  for (const part of [1, 2]) {
    const expected = solver.expected(part);
    const [answer, duration] = timed(() => solver.solve(text, part, ENABLE_LOGS));
    printTestResult(day, part, expected, answer, duration);
  }
}
