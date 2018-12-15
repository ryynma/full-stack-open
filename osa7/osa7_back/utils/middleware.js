/*
 * Lukee requestin Authorization-headerin ja sijoittaa tokenin kenttään request.token,
 * jos tyyppinä on Bearer.
 */
const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7)
    }
    next()
}

const logger = (request, response, next) => {
    // ei tulosteta testauksen aikana
    if (process.env.NODE_ENV === 'test') {
        return next()
    }

    console.log('Method:', request.method)
    console.log('Path:', request.path)
    console.log('Body:', request.body)
    console.log('---')
    next()
}

const error = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
    tokenExtractor,
    logger,
    error
}