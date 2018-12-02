import React from 'react'
import { shallow } from 'enzyme'
import SimpleBlog from './SimpleBlog'

describe('<SimpleBlog />', () => {

    let simpleblog
    let mockHandler
    let blogComponent

    beforeAll(() => {
        // Luodaan testattava blogiartikkeli
        simpleblog = {
            title: 'Testiblogi',
            author: 'T. Testaaja',
            likes: 1
        }
        mockHandler = jest.fn()
        blogComponent = shallow(
            <SimpleBlog
                blog={simpleblog}
                onClick={mockHandler}
            />
        )
        // console.log(blogComponent.debug())
    })

    it('renders title, author and likes', async () => {
        // Haetaan testattava sisältö
        const contentDiv = blogComponent.find('.content')
        expect(contentDiv.text()).toContain(`${simpleblog.title} ${simpleblog.author}`)

        const likesDiv = blogComponent.find('.likes')
        expect(likesDiv.text()).toContain(`blog has ${simpleblog.likes} likes`)
    })

    it('clicking the button twice calls event handler twice', () => {
        const button = blogComponent.find('button')
        button.simulate('click')
        button.simulate('click')
        expect(mockHandler.mock.calls.length).toBe(2)
    })

})