Feature: Book Store API End-to-End Flow

Background:
  * url "https://demoqa.com"
  * def generateUUID = function(){ return java.util.UUID.randomUUID() + "" }
  * def rawId = generateUUID().replaceAll("-", "")
  * def username = "api_" + rawId.substring(0, 15)
  * def password = "Qa!9" + rawId.substring(0, 12)

Scenario: Automate single flow: Register, Login, Search and Add Book, Verify Collection, Delete Book
  # 1. Register & login
  Given path "Account", "v1", "User"
  And request { userName: "#(username)", password: "#(password)" }
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

  # Verify Authorized
  Given path "Account", "v1", "Authorized"
  And request { userName: "#(username)", password: "#(password)" }
  When method post
  Then status 200
  * match response == "true"

  # 2. Search and add book to collection
  Given path "BookStore", "v1", "Books"
  When method get
  Then status 200
  * def books = response.books
  * def targetBook = karate.filter(books, function(x){ return x.title == "Git Pocket Guide" })[0]
  * def isbn = targetBook.isbn

  # Add book to collection
  Given path "BookStore", "v1", "Books"
  And header Authorization = "Bearer " + token
  And request { userId: "#(userId)", collectionOfIsbns: [{ isbn: "#(isbn)" }] }
  When method post
  Then status 201
  * match response.books[0].isbn == isbn

  # 3. See list of your book collection
  Given path "Account", "v1", "User", userId
  And header Authorization = "Bearer " + token
  When method get
  Then status 200
  * match response.books[*].isbn contains isbn
  * match response.books[0].title == "Git Pocket Guide"

  # 4. Delete book from your collection
  Given path "BookStore", "v1", "Book"
  And header Authorization = "Bearer " + token
  And request { isbn: "#(isbn)", userId: "#(userId)" }
  When method delete
  Then status 204

  # Verify list of book collection is empty
  Given path "Account", "v1", "User", userId
  And header Authorization = "Bearer " + token
  When method get
  Then status 200
  * match response.books == "#[0]"

  # 5. Cleanup user account
  Given path "Account", "v1", "User", userId
  And header Authorization = "Bearer " + token
  When method delete
  Then status 204
