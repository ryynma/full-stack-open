const blogs = [
    {
        _id: '5c030fd0e1647605083acf68',
        likes: 3,
        author: 'Martin Fowler',
        title: 'Continuous integration',
        url: 'https://martinfowler.com',
        user: {
            _id: '5c02054fbbab331d482b8dcb',
            username: 'mluukkai',
            name: 'Matti Luukkainen'
        }
    },
    {
        _id: '5c031bcfe1647605083acf69',
        likes: 2,
        author: 'M. Jones',
        title: 'The OAuth 2.0 Authorization Framework: Bearer Token Usage',
        url: 'https://tools.ietf.org/html/rfc6750',
        user: {
            _id: '5c020559bbab331d482b8dcc',
            username: 'hellas',
            name: 'Arto Hellas'
        }
    },
    {
        _id: '5c031eb5e1647605083acf6a',
        likes: 1,
        author: 'Joel Spolsky',
        title: 'The Joel Test: 12 Steps to Better Code',
        url: 'https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/',
        user: {
            _id: '5c020559bbab331d482b8dcc',
            username: 'hellas',
            name: 'Arto Hellas'
        }
    }
]

const getAll = () => {
    return Promise.resolve(blogs)
}

const setToken = () => {}

export default { getAll, blogs, setToken }