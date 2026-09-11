@web @smoke @single-flow
Feature: Book Store single end-to-end flow
  As a reader
  I want to register, log in, search for a book, add it to my collection,
  verify my collection, delete the book, and log out.

  Scenario: Complete reader single flow
    Given I register a unique reader
    When I log in to the bookstore
    And I search for "Git Pocket Guide"
    And I add that book to my collection
    Then my collection contains that book after a reload
    When I delete that book from my collection
    Then my collection is empty after a reload
    When I log out
    Then I cannot view my collection without logging in
