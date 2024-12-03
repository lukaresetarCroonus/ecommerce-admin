# Router
In order to add more routes to both menu and the router itself, edit the `routes.js` file.
All other files in this directory should not be changed.

## Code
Each top route must be indexed by a code.

This code determines if a user is able to access a particular route.
Which codes are available for a user is returned by the server after login.

## Format
The format of each route in the `routes.js` is a basic array with either 5 of 2 elements.

### Definition with 5 elements
Used for routes that are visible in the main menu.

- string - path to the route 
- string - name of the route that is shown in the main menu 
- icon - imported and referenced from `@fortawesome/free-solid-svg-icons `
- group - menu group in which to show the link, as defined in `utils.js` 
- component - the React component that will be shown for this route
- array - list of children for this route, defined with 5 or 2 columns 

### Definition with 2 elements
Used for routes that are not visible in the main menu, usually as children of top routes.

- string - path to the route
- component - the React component that will be shown for this route

## Nesting
In order to add children, set then as the 6th element in the long definition. A child can have its own children, there is no limit for nesting.

Children are defined as an array of routes (same definition as above).

In a child its `path` (first element in definition) must not start with a forward slash `/`.
Instead, it should define only the path after the parent's path - it will be automatically appended.

