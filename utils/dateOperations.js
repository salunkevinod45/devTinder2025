const {format, compareAsc, formatDistance, subDays, addDays} = require("date-fns");

console.log(format(new Date(),"MM/dd/yyyy"))


const dates = [
  new Date(1995, 6, 2),
  new Date(1987, 1, 11),
  new Date(1989, 6, 10),
];
console.log(dates.sort(compareAsc));

const test = formatDistance(addDays(new Date(), 3), new Date(), { addSuffix: true });
console.log(test)
console.log("date operations");