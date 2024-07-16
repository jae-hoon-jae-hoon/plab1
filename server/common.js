const dayjs = require('dayjs');

const formatDate = () => {
    let regDate = dayjs(new Date(), "YYYY-MM-DD HH:mm:ss");
    regDate = regDate.format("YYYY-MM-DD HH:mm:ss");
    return regDate
}


module.exports = {
    formatDate,
    
};