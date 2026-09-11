@api
Feature: Book Store API - Single E2E Flow

  Background:
    * url 'https://demoqa.com'
    * def uuid = java.util.UUID.randomUUID() + ''
    * def username = 'user_' + uuid.substring(0, 8)
    * def password = 'Password123!'
    * def user = { userName: '#(username)', password: '#(password)' }

  Scenario: Automate single flow: 1. Register & login, 2. Search & add book, 3. View collection, 4. Delete book, 5. Logout
    # 1. Register & login
    Given path '/Account/v1/User'
    And request user
    When method post
    Then status 201
    * def userId = response.userID
    * match response.username == username
    Given path '/Account/v1/GenerateToken'
    And request user
    When method post
    Then status 200
    * match response.status == 'Success'
    * def token = response.token
    * def auth = 'Bearer ' + token
    # 2. Search and add book to collection
    Given path '/BookStore/v1/Books'
    When method get
    Then status 200
    * def isbn = karate.jsonPath(response, "$.books[?(@.title=='Git Pocket Guide')].isbn")[0]
    * match isbn == '#present'
    Given path '/BookStore/v1/Books'
    And header Authorization = auth
    And request { userId: '#(userId)', collectionOfIsbns: [{ isbn: '#(isbn)' }] }
    When method post
    Then status 201
    * match response.books[0].isbn == isbn
    # 3. See list of your book collection
    Given path '/Account/v1/User', userId
    And header Authorization = auth
    When method get
    Then status 200
    * match response.books[*].isbn contains isbn
    * match response.books contains deep { isbn: '#(isbn)', title: 'Git Pocket Guide' }
    # 4. Delete book from your collection
    Given path '/BookStore/v1/Book'
    And header Authorization = auth
    And request { isbn: '#(isbn)', userId: '#(userId)' }
    When method delete
    Then status 204
    # Verify list of book collection is empty
    Given path '/Account/v1/User', userId
    And header Authorization = auth
    When method get
    Then status 200
    * match response.books == '#[0]'
    # 5. Logout
    # Verify that unauthenticated requests to the user collection return 401 Unauthorized
    Given path '/Account/v1/User', userId
    When method get
    Then status 401
    * match response.message == 'User not authorized!'
    # Cleanup: Delete disposable user account
    Given path '/Account/v1/User', userId
    And header Authorization = auth
    When method delete
    Then status 204
