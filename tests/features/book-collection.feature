@web @smoke @book-collection
Feature: Personal book collection
  A registered reader can add and remove a book from their collection.

  Scenario: Add and remove a book
    Given I register a unique reader
    And I log in to the bookstore
    And I search for "Git Pocket Guide"
    And I add that book to my collection
    Then my collection contains that book after a reload
    When I delete that book from my collection
    Then my collection is empty after a reload
