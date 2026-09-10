@web @smoke @collection
Feature: Manage a personal book collection
  A registered reader can find, keep and remove a book.
  Registration is through the UI by default; API setup is an explicit alternative.

  Scenario: Register, log in, add and remove a book, then log out
    Given I register a unique reader
    When I log in to the bookstore
    And I search for "Git Pocket Guide"
    And I add that book to my collection
    Then my collection contains that book after a reload
    When I delete that book from my collection
    Then my collection is empty after a reload
    When I log out
    Then I cannot view my collection without logging in
