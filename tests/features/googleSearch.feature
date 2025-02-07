Feature: Google Search

Scenario: Search for Adeo on Google
  Given I open Google
  When I search for "Adeo"
  Then I should see a link to the Adeo website
