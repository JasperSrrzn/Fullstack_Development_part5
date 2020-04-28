describe('Blog app', function(){
  beforeEach(function(){
    cy.request('POST','http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkaai',
      password: 'salainen'
    }
    cy.request('POST','http://localhost:3003/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function(){
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function(){
    it('succeeds with correct credentials', function(){
      cy.get('#username').type('mluukkaai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function(){
      cy.get('#username').type('mluukkaai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
      cy.get('.notification')
        .should('contain','wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function(){
    beforeEach(function(){
        cy.login({username: 'mluukkaai', password: 'salainen'})
    })

    it('a blog can be created', function(){
      cy.contains('new blog').click()
      cy.get('#title').type('a cypress blog')
      cy.get('#author').type('tester')
      cy.get('#url').type('test.com')
      cy.get('#createBlog-button').click()
      cy.get('.notification')
        .should('contain','a new blog added: a cypress blog from tester')
        .and('have.css','color', 'rgb(0, 128, 0)')
      cy.contains('a cypress blog tester')
    })

    describe('when blog is already in list', function(){
      beforeEach(function(){
        cy.createBlog({title: 'a cypress blog', author: 'tester', url: 'test.com'})
      })

      it('a blog can be liked', function(){
        cy.contains('a cypress blog tester').parent().as('theBlog')
        cy.get('@theBlog').find('#view-button').as('viewButton')
        cy.get('@viewButton').click()
        cy.get('@theBlog').contains('likes 0')
        cy.get('@theBlog').get('#like-button').click()
        cy.get('@theBlog').parent().contains('likes 1')
      })

      it('a blog can be deleted by the creator', function(){
        cy.contains('a cypress blog tester').parent().as('theBlog')
        cy.get('@theBlog').find('#view-button').as('viewButton')
        cy.get('@viewButton').click()
        cy.get('@theBlog').find('#delete-button').click()
        cy.get('html').should('not.contain','a cypress blog tester')
      })

      describe('when multiple blogs are in the list', function(){
        beforeEach(function(){
          cy.createBlog({title: 'a second cypress blog', author: 'tester', url: 'test.com'})
          cy.contains('a cypress blog tester').parent().as('theFirstBlog')
          cy.contains('a second cypress blog tester').parent().as('theSecondBlog')
          cy.get('@theFirstBlog').find('#view-button').click()
          cy.get('@theSecondBlog').find('#view-button').click()
          cy.get('@theFirstBlog').find('#like-button').as('theFirstLikeButton')
          cy.get('@theSecondBlog').find('#like-button').as('theSecondLikeButton')
          cy.get('@theSecondLikeButton').click()
          cy.get('@theSecondLikeButton').click()
        })

        it.only('check if the blogs are correctly ranked', function(){

          cy.contains('a second cypress blog tester')
          cy.get('#likes').parent().as('first')
          cy.get('@first').next().as('second')
          cy.get('@first').contains('likes 2')
          cy.get('@second').contains('likes 0')

        })
      })
    })
  })


})
