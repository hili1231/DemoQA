@api
Feature: Book Store API - Single E2E Flow

  Background:
    * url baseURL

  Scenario: Automate single flow: 1. Register & login, 2. Search & add book, 3. View collection, 4. Delete book, 5. Logout
    # 1. Register & login
    Given path '/Account/v1/User'
    And request account.user
    When method post
    * set account.userId = response.userID
    Then status 201
    * match account.userId == '#uuid'
    * def userId = account.userId
    * match response.username == account.user.userName
    * match response.books == []
    Given path '/Account/v1/GenerateToken'
    And request account.user
    When method post
    Then status 200
    * match response.status == 'Success'
    * def token = response.token
    * match token == '#string'
    * assert token.length > 0
    * set account.token = token
    * def auth = 'Bearer ' + token
    Given path '/Account/v1/Authorized'
    And request account.user
    When method post
    Then status 200
    # DemoQA returns this boolean as text/plain rather than application/json.
    And match response == 'true'
    # 2. Search and add book to collection
    Given path '/BookStore/v1/Books'
    When method get
    Then status 200
    * def isbn = karate.jsonPath(response, "$.books[?(@.title=='Git Pocket Guide')].isbn")[0]
    * match isbn == '9781449325862'
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
    * match response.books == '#[1]'
    * match response.books contains deep { isbn: '#(isbn)', title: 'Git Pocket Guide', author: 'Richard E. Silverman' }
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
    # 5. API equivalent: access without a token is rejected.
    # The API has no logout endpoint; this does not prove token revocation.
    Given path '/Account/v1/User', userId
    When method get
    Then status 401
    * match response.message == 'User not authorized!'
