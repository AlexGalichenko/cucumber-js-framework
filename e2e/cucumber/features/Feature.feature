Feature: Browse Page

  Background:
    Given I login
    When I should be on "Home" page

   # =========================================== Browse Page ==============================================

  @smoke
  @regression
  @browsePage
  Scenario: Verify that node content appears on the right side
    When I click "Browse Tree 1st 1st Lvl Node"
    And I click "Browse Tree 1st 2nd Lvl Node"
    Then I should be on "Base" page