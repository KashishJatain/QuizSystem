export const topic = (totalQuestions) => {
  const cards = [];
  const setsOf75 = Math.ceil(totalQuestions / 75);
  
  for (let i = 0; i < setsOf75; i++) {
      cards.push({
          topic: `Set ${i + 1}`,
          offset: i
      });
  }
  return cards;
};