import React from 'react'
import { mount } from 'enzyme'
import App from './App'
import blogService from './services/blogs'

describe('<App />', () => {
    let app

    describe('when user is not logged in', () => {
        beforeEach(() => {
            // Simuloidaan että käyttäjä ei ole kirjautunut
            localStorage.clear()
            app = mount(<App />)
        })

        it('only login form is rendered', () => {
            app.update()
            // console.log(app.debug())

            expect(app.exists('.loginContent')).toEqual(true)
            expect(app.exists('.blogsContent')).toEqual(false)
        })    
    })

    describe('when user is logged in', () => {

        beforeEach(async () => {
            // Simuloidaan kirjautunutta käyttäjää
            const user = {
                username: 'tester',
                token: '1231231214',
                name: 'T. Testaaja'
            }
            await localStorage.setItem('loggedBlogListUser', JSON.stringify(user))
            app = mount(<App />)
        })

        it('all blogs are rendered without login form', () => {
            app.update()
            // console.log(app.debug())
    
            expect(app.exists('.loginContent')).toEqual(false)
            expect(app.exists('.blogsContent')).toEqual(true)
        })    
    })
})