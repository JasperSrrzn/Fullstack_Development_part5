import React from 'react'
import Blog from './Blog'

const BlogList = ({ blogs, removeBlog, likeBlog, loggedInUser }) => {


  const mapFunction = (id, blog) => {
    return <Blog
        key={id}
        blog={blog}
        likeFunction = {likeBlog(blog)}
        removeFunction={removeBlog(blog)}
        loggedInUser={loggedInUser}/>

  }
  return (
    <div>
      {blogs
        .sort((blogA, blogB) => blogB.likes - blogA.likes)
        .map(blog => mapFunction(blog.id, blog))
      }
    </div>
  )
}

export default BlogList
