export const getHumanTime = (deadline) => {
  const distance = deadline - Math.floor(Date.parse(new Date().toLocaleString()) / 1000);

  return {
    hours: () => Math.floor(distance / 3600),
    minutes: () => Math.floor((distance % 3600) / 60),
  };
};
