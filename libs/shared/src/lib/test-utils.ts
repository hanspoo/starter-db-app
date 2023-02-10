export const randomEmail = () => "email" + dameRandom() + "@myapp.com";
export const randomCseg = () => dameRandom();

function dameRandom() {
  return getRandomInt(1000000, 9000000);
}
function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
