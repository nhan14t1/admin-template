export const formatNumber = (number, separateSymbol = null) => {
  if (number == null || number == undefined) {
    return '';
  }

  let result = number.toLocaleString();
  if (separateSymbol) {
    result = result.replaceAll(separateSymbol, ',');
  }

  return result;
}