import React, { useState } from 'react'

const Blog = ({ blog, likeFunction, removeFunction, loggedInUser }) => {

  const [showDetails, setShowDetails] = useState(false)

  const showRemoveButton = { display: blog.user.username === loggedInUser.username ? '': 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleShowDetails = () => {
    setShowDetails(!showDetails)
  }


  if (showDetails){
    return (
      <div style={blogStyle} className="blogDetailed">
        <p>{blog.title} {blog.author} <button id='hide-button' onClick={handleShowDetails}>hide</button> </p>
        <p>{blog.url}</p>
        <p id='likes'>likes {blog.likes} <button id='like-button' onClick={likeFunction}>like</button></p>
        <p>{blog.user.name}</p>
        <button id='delete-button' onClick={removeFunction} style={showRemoveButton} >remove</button>
      </div>
    )
  } else {
    return (
      <div style={blogStyle} className="blogNotDetailed">
        <span>{blog.title} {blog.author}</span> <button id='view-button' onClick={handleShowDetails}>view</button>
      </div>
    )
  }

}
export default Blog
