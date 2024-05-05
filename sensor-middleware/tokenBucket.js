const redisClient = require('./tokenBucketConnections');

function checkPacketSize(request, maxSize) {
    const size = request.body.length;

    if (size > maxSize) {
        return false;
    }
    else {
        return true;
    }
}

function retrieveNumTokens() {
    redisClient.get('tokens', (error, numTokens) => {
        if (error) {
            console.error('Error retrieving number of tokens:', error);
        }
        else {
            console.log('Number of tokens:', numTokens);
            return numTokens;
        }
    });

}

function checkTokens(req, res, next) {

    const PACKET_SIZE = process.env.PACKET_SIZE || 1000;

    if (checkPacketSize(req, PACKET_SIZE)) {
        return res.status(413).send("Request too large"); 
    }
    else{
        if (retrieveNumTokens() > 0) {
            redisClient.decr('tokens', (error) => {
                if (error) {
                    console.error('Error decrementing tokens:', error);
                }
                else {
                    return next();
                }
            });
        }
        else {
            return res.status(429).send("Too many requests");
        }
    }
    
}

function addToken(req, res) {
    redisClient.incrby('tokens', 1, (error) => {
        if (error) {
            console.error('Error adding tokens:', error);
        }
        else {
            console.log('Token added');
            res.status(200).send("Data received");
        }
    });
}

module.exports = {
    checkTokens,
    addToken
};
