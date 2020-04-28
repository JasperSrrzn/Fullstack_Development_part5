import React, { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorColor, setErrorColor] = useState(null)

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => {
        setBlogs( blogs )
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setErrorMessage('Log in successful')
      setErrorColor('green')
      setTimeout(() => {
        setErrorMessage(null)
        setErrorColor(null)
      },5000)
    } catch(exception){
      setErrorMessage('wrong username or password')
      setErrorColor('red')
      setTimeout(() => {
        setErrorMessage(null)
        setErrorColor(null)
      },5000)
    }
  }



  const loginForm = () => (
    <div>
      <h1>log in to application</h1>
      <Notification message={errorMessage} color={errorColor}/>
      <form onSubmit={handleLogin}>
        <div>
          username<input
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}/>
        </div>
        <div>
          password<input
            id="password"
            type="text"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}/>
        </div>
        <button id="login-button" type="submit">login</button>
      </form>
    </div>
  )



  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setErrorMessage(`a new blog added: ${returnedBlog.title} from ${returnedBlog.author}`)
        setErrorColor('green')
        setTimeout(() => {
          setErrorMessage(null)
          setErrorColor(null)
        },5000)
      }).catch(() => {
        setErrorMessage('Blog details not complete')
        setErrorColor('red')
        setTimeout(() => {
          setErrorMessage(null)
          setErrorColor(null)
        },5000)
      })
  }

  const blogFormRef = React.createRef()

  const handleDelete = (blogToDelete) => () => {
    if (window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}`)){
      blogService.deleteBlog(blogToDelete)
      setBlogs(blogs.filter(blog => blog.id!==blogToDelete.id))
    }
  }

  const handleLike = (blogToLike) => async () => {
    const updatedBlog = await blogService.addLike(blogToLike)
    setBlogs(blogs.map(blog => {
      if (blog.id===blogToLike.id){
        return updatedBlog
      } else {
        return blog
      }
    }))
  }

  const blogForm = () => (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} color={errorColor}/>
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogList blogs={blogs} removeBlog={handleDelete} likeBlog={handleLike} loggedInUser={user}/>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
    </div>
  )


  return (
    <div>
      {user === null ? loginForm() : blogForm()}
    </div>

  )

}

export default App
