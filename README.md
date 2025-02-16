# action-selector

Library that allows invoking actions (element click / focus or custom) for a specific selector inside of a DOM element

TODO: add more information about project, development

## Test

### Unit tests

TODO

### In Browser

Setup:
- `npm run build`
- `cp test/index.html dist/`
- `npx http-server dist/`

Open `http://localhost:8080/index.html` in browser to check if library is working in a browser environment.

Expectations:
- automatically redirected to `http://localhost:8080/index.html?navigation=...`
- all 3 paragraphs are automatically clicked (can be confirmed with the added `Clicked` text)
- the result of the invoked action is visible in console log as `{success: false, errors: Array(1)}`