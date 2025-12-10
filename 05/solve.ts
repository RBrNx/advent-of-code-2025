const isFreshIngredient = (ingredientRange: string, ingredient: string) => {
  const [min, max] = ingredientRange.split('-').map(Number);

  const ingredientValue = Number(ingredient);
  return ingredientValue >= min && ingredientValue <= max;
};

const partOne = (input: string[]) => {
  const separatorIndex = input.indexOf('');
  const freshIngredientRanges = input.slice(0, separatorIndex);
  const availableIngredients = input.slice(separatorIndex + 1);
  let totalFreshIngredients = 0;

  for (const ingredient of availableIngredients) {
    for (const range of freshIngredientRanges) {
      if (isFreshIngredient(range, ingredient)) {
        totalFreshIngredients++;
        break;
      }
    }
  }

  return totalFreshIngredients;
};

type RangePiece = {
  value: number;
  index: number;
  type: 'min' | 'max';
};

const partTwo = (input: string[]) => {
  const separatorIndex = input.indexOf('');
  const freshIngredientRanges = input
    .slice(0, separatorIndex)
    .map(range => range.split('-').map(Number))
    .sort((a, b) => {
      const [aMin] = a;
      const [bMin] = b;
      return aMin - bMin;
    });

  const rangePieces: RangePiece[] = [];

  // Split all ranges into a single array of min and max pieces
  for (const [index, range] of freshIngredientRanges.entries()) {
    const [min, max] = range;
    rangePieces.push({ value: min, index, type: 'min' });
    rangePieces.push({ value: max, index, type: 'max' });
  }

  // Sort pieces by value, with mins before maxes when equal
  rangePieces.sort((a, b) => {
    if (a.value === b.value) {
      return a.type === 'min' && b.type === 'max' ? -1 : 1;
    }
    return a.value - b.value;
  });

  let currentOpenRanges: number[] = [];
  let totalFreshIngredientIds = 0;
  let currentValue = 0;

  // Process each piece in order, tracking open ranges
  for (const point of rangePieces) {
    // If this is a min point and there are no open ranges, we have found a fresh ID range
    if (point.type === 'min') {
      if (currentOpenRanges.length === 0) currentValue = point.value;
      currentOpenRanges.push(point.index);
    } else if (point.type === 'max') {
      // This is a max point, so we are closing a range
      currentOpenRanges = currentOpenRanges.filter(i => i !== point.index);

      // If there are now no open ranges, we can consider the whole range is fresh IDs
      if (currentOpenRanges.length === 0) {
        totalFreshIngredientIds += point.value - currentValue + 1;
      }
    }
  }

  return totalFreshIngredientIds;
};

const solve = (input: string[], part: number) => (part === 1 ? partOne(input) : partTwo(input));

const expected = (part: number) => (part === 1 ? 513 : 339668510830757);

export { solve, expected };
