


const reverse = (aykalam) => {return aykalam.split("").reverse().join("");}
const average = (aykalam_arr) => {
    const reducer = (sum, item) => {
        return sum + item;
    };
    return aykalam_arr,reduce(reducer, 0)/aykalam_arr.length;
};
module.exports = {reverse, average};