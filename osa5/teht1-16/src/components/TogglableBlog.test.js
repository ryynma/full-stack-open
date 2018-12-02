import React from 'react'
import { shallow } from 'enzyme'
import TogglableBlog from './TogglableBlog'

describe('<TogglableBlog />', () => {
    let blog
    let blogComponent

    beforeAll(() => {
        // Luodaan testattava blogiartikkeli
        blog = {
            key: 'mockkey',
            title: 'Testiblogi',
            author: 'K. Kirjoittaja',
            likes: 1,
            url: 'https://testiosoite.com',
            user: {
                name: 'T. Testaaja'
            }
        }
        blogComponent = shallow(
            <TogglableBlog
                blog={blog}
                handleLike={jest.fn()}
                handleDelete={jest.fn()}
                currentUsername='testuser'
            />
        )
        // console.log(blogComponent.debug())
    })

    it('renders title, author, url, likes, and user name', async () => {
        // Haetaan testattava sisältö
        const titleDiv = blogComponent.find('.clickableTitle')
        expect(titleDiv.text()).toContain(`${blog.title} ${blog.author}`)

        const urlDiv = blogComponent.find('.url')
        expect(urlDiv.text()).toContain(`${blog.url}`)

        const likesDiv = blogComponent.find('.likes')
        expect(likesDiv.text()).toContain(`${blog.likes} likes`)

        const creatorDiv = blogComponent.find('.creator')
        expect(creatorDiv.text()).toContain(`added by ${blog.user.name}`)
    })

    it('at start the children are not displayed', () => {
        const div = blogComponent.find('.togglableContent')
        expect(div.getElement().props.style).toEqual({ display: 'none' })
    })

    it('after clicking name the details are displayed', () => {
        const clickableDiv = blogComponent.find('.clickableTitle')
        clickableDiv.simulate('click')

        const div = blogComponent.find('.togglableContent')
        expect(div.getElement().props.style).toEqual({ display: '' })
    })

})