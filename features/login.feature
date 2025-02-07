Feature: Login

  @AUT01
  Scenario: Internal - Authentication - Nominal Case - Access to the internal supplier portal
    Given I am connected as "ADMIN_BU_INTERNAL" user on portal partner side
    Then Error message is displayed
    When I click on "home" button
    Then I am redirected to Ping authentication page

  @AUT02
  Scenario: Internal - Authentication - No Passing Case - As an internal, I can't access to the supplier portal (Partner side)
    Given I am connected as "ADMIN_BU_INTERNAL" user on portal partner side
    Then Error message is displayed
    When I click on "home" button
    Then I am redirected to Ping authentication page

  @AUT03
  Scenario Outline: Partner - Authentication - Nominal Case - Log in to Supplier Portal
    Given I am connected as "<TLDAP>" user with password "SUPPLIER_USER_PASSWORD"
    Then I am redirected to "Platform" page
    Examples:
      | TLDAP                 |
      | LMFR_ADMIN_SUPPLIER   |
      | LMES_ADMIN_SUPPLIER   |

  @AUT04
  Scenario: Partner - Authentication - No Passing Case - As a partner, I can't access the internal supplier portal
    Given I am connected as "LMFR_ADMIN_SUPPLIER" user on portal internal side
    Then Error message is displayed
    When I click on "home" button
    Then I am redirected to Ping authentication page

  @AUT05
  Scenario: Partner - Authentification - Nominal Case - Last connection date is updated when a user connects
    Given I am connected as "LMES_ADMIN_SUPPLIER" user with password "SUPPLIER_USER_PASSWORD"
    When I access to "My Team" from user menu
    Then User last login date is today's date

  @AUT06
  Scenario: Partner - Authentification - Nominal Case - I can access the supplier portal without VPN
    Given I am connected as "LMFR_ADMIN_SUPPLIER" user with password "SUPPLIER_USER_PASSWORD"
    And I am not connected to the VPN
    Then I am redirected to "Home" page
