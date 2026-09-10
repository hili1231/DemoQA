@web @catalog @smoke @book-search
Feature: Book search
  A reader can find a book and view its details.

  Scenario: Search for a book
    Given I register a unique reader
    And I log in to the bookstore
    When I search for "Git Pocket Guide"
    Then I see the details for "Git Pocket Guide"
