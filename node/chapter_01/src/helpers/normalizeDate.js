function normalizeDate(dateString) {
  if (dateString.includes("T")) {
    const date = new Date(dateString);
    return date;
  } else {
    const [day, month, year] = dateString.split("/");
    const date = new Date(`${month}/${day}/${year}`)

    return date;
  }
}

module.exports = normalizeDate;