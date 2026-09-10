@web @smoke @authentication
Feature: Reader authentication
  A reader can create an account, sign in and sign out.

  Scenario: Register, log in and log out
    Given I register a unique reader
    When I log in to the bookstore
    Then I see my reader profile
    When I log out
    Then I cannot view my collection without logging in
