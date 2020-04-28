import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {

  let blog

  beforeEach(() => {
   blog = {
      title: 'this is a test',
      author: 'tester',
      likes: 1,
      url: 'test.com',
      user: {
        username: 'abc123',
        name: 'reader'
      }
    }
  })

  test('renders blog ', () => {
    const component = render(
      <Blog
        blog={blog}
        loggedInUser={blog.user.username}/>
    )

    expect(component.container).toHaveTextContent('this is a test')
    expect(component.container).toHaveTextContent('tester')
    expect(component.container).not.toHaveTextContent(1)
    expect(component.container).not.toHaveTextContent('test.com')
  })

  test('when view button is clicked, details are shown', () => {
    const component = render(
      <Blog
        blog={blog}
        loggedInUser={blog.user.username}/>
    )

    const button = component.getByText('view')
    fireEvent.click(button)
    expect(component.container).toHaveTextContent('this is a test')
    expect(component.container).toHaveTextContent('tester')
    expect(component.container).toHaveTextContent(1)
    expect(component.container).toHaveTextContent('test.com')
  })

  test('like button works', () => {
    const mockLikeFunction = jest.fn()

    const component = render(
      <Blog
        blog={blog}
        likeFunction={mockLikeFunction}
        loggedInUser={blog.user.username}/>
    )

    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)
    
    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)
    expect(mockLikeFunction.mock.calls).toHaveLength(2)
  })


})
