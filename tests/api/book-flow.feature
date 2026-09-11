Feature: Book Store API End-to-End Flow
@api
Feature: Book Store API - Single E2E Flow

Background:
  * url "https://demoqa.com"
  * def generateUUID = function(){ return java.util.UUID.randomUUID() + "" }
  * def rawId = generateUUID().replaceAll("-", "")
  * def username = "api_" + rawId.substring(0, 15)
  * def password = "Qa!9" + rawId.substring(0, 12)
  Background:
    * url 'https://demoqa.com'
    * def uuid = java.util.UUID.randomUUID() + ''
    * def username = 'user_' + uuid.substring(0, 8)
    * def password = 'Password123!'
    * def user = { userName: '#(username)', password: '#(password)' }

Scenario: Automate single flow: Register, Login, Search and Add Book, Verify Collection, Delete Book
  # 1. Register & login
  Given path "Account", "v1", "User"
  And request { userName: "#(username)", password: "#(password)" }
  When method post
  Then status 201
  * def userId = response.userID
  * match response.username == username
  Scenario: Automate single flow: 1. Register & login, 2. Search & add book, 3. View collection, 4. Delete book, 5. Logout
    # 1. Register & login
    Given path '/Account/v1/User'
    And request user
    When method post
    Then status 201
    * def userId = response.userID
    * match response.username == username

  # Login / Generate Token
  Given path "Account", "v1", "GenerateToken"
  And request { userName: "#(username)", password: "#(password)" }
  When method post
  Then status 200
  * match response.status == "Success"
  * def token = response.token
    Given path '/Account/v1/GenerateToken'
    And request user
    When method post
    Then status 200
    * match response.status == 'Success'
    * def token = response.token
    * def auth = 'Bearer ' + token

  # Verify Authorized
  Given path "Account", "v1", "Authorized"
  And request { userName: "#(username)", password: "#(password)" }
  When method post
  Then status 200
  * match response == "true"
    # 2. Search and add book to collection
    Given path '/BookStore/v1/Books'
    When method get
    Then status 200
    * def isbn = karate.jsonPath(response, "$.books[?(@.title=='Git Pocket Guide')].isbn")[0]
    * match isbn == '#present'

  # 2. Search and add book to collection
  Given path "BookStore", "v1", "Books"
  When method get
  Then status 200
  * def books = response.books
  * def targetBook = karate.filter(books, function(x){ return x.title == "Git Pocket Guide" })[0]
  * def isbn = targetBook.isbn
    Given path '/BookStore/v1/Books'
    And header Authorization = auth
    And request { userId: '#(userId)', collectionOfIsbns: [{ isbn: '#(isbn)' }] }
    When method post
    Then status 201
    * match response.books[0].isbn == isbn

  # Add book to collection
  Given path "BookStore", "v1", "Books"
  And header Authorization = "Bearer " + token
  And request { userId: "#(userId)", collectionOfIsbns: [{ isbn: "#(isbn)" }] }
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

  # 3. See list of your book collection
  Given path "Account", "v1", "User", userId
  And header Authorization = "Bearer " + token
  When method get
  Then status 200
  * match response.books[*].isbn contains isbn
  * match response.books[0].title == "Git Pocket Guide"
    # 4. Delete book from your collection
    Given path '/BookStore/v1/Book'
    And header Authorization = auth
    And request { isbn: '#(isbn)', userId: '#(userId)' }
    When method delete
    Then status 204

  # 4. Delete book from your collection
  Given path "BookStore", "v1", "Book"
  And header Authorization = "Bearer " + token
  And request { isbn: "#(isbn)", userId: "#(userId)" }
  When method delete
  Then status 204
    # Verify list of book collection is empty
    Given path '/Account/v1/User', userId
    And header Authorization = auth
    When method get
    Then status 200
    * match response.books == '#[0]'

  # Verify list of book collection is empty
  Given path "Account", "v1", "User", userId
  And header Authorization = "Bearer " + token
  When method get
  Then status 200
  * match response.books == "#[0]"
    # 5. Logout
    # Verify that unauthenticated requests to the user collection return 401 Unauthorized
    Given path '/Account/v1/User', userId
    When method get
    Then status 401
    * match response.message == 'User not authorized!'

  # 5. Cleanup user account
  Given path "Account", "v1", "User", userId
  And header Authorization = "Bearer " + token
  When method delete
  Then status 204
    # Cleanup: Delete disposable user account
    Given path '/Account/v1/User', userId
    And header Authorization = auth
    When method delete
    Then status 204
