export async function getPriceData() {
  const response = await fetch("https://data.priceofgoods.com/latest.json");
  return response.json();
}
