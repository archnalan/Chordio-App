
const ParseDateRange = (dateRage: string) => {
  if(!dateRage){
    return {startYear: null, endYear: null}
  }

  const [start, end] = dateRage.split("-")
  return {
    startYear: parseInt(start, 10),
    endYear: parseInt(end, 10),
  }
}

export default ParseDateRange