const {redisClient, readData, addToken, takeToken} = require('./tokenBucketConnections');

function checkPacketSize(size, maxSize) {
    console.log('Packet size:', size);
    return size > maxSize;
}

async function retrieveNumTokens() {
    let numTokens = await readData('tokens');
    console.log('Number of tokens:', numTokens);
    return numTokens;
}


async function checkTokens(req, res, next) {
    const PACKET_SIZE = process.env.PACKET_SIZE || 1000;
    const size = Object.keys(req).length;

    if (checkPacketSize(size, PACKET_SIZE)) {
        return res.status(413).send("Request too large");
    } else {
        const numTokens = await retrieveNumTokens();

        if (numTokens > 0) {
            await takeToken();
            return next();
        } else {
            return res.status(429).send("Too many requests");
        }
    }
}


async function giveBackToken(req, res) {
    await addToken();
    return res.status(200).send("Data received");
}


module.exports = {
    checkTokens,
    giveBackToken
};
