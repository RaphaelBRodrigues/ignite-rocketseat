function stringToDate(dateString) {
  const [day, month, year] = dateString.split("/");
  const date = new Date(`${month}/${day}/${year}`)

  return date;
}

module.exports = stringToDate;