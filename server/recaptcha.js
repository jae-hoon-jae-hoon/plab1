
// Library
const axios = require('axios')

// CONST
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECOND_KEY;

const verifyRecaptcha = async (reCaptchToken) => {
    const secretKey = RECAPTCHA_SECRET_KEY;
    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${reCaptchToken}`
        );
        const captchaData = response.data;

        if (!(captchaData.success && captchaData.score >= 0.5)) {
            throw new Error("reCaptcha verification failed");
        }

        return true;
    } catch (err) {
        //console.log(err);
        throw new Error("reCaptcha verification failed: " + err.message);
    }
};

module.exports = {
    verifyRecaptcha
};