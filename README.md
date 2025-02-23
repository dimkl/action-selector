# action-selector

Library that allows invoking actions (element click / focus or custom) for a specific selector inside of a DOM element

TODO: add more information about project, development

## Examples

```javascript
import {
  BatchInstructionDecoder,
  ActionSelector,
} from "@dimkl/action-selector";
const searchParams = new URLSearchParams(document.location.search);
// example value: 633d23737465702d317c633d23737465702d327c633d23737465702d337c633d23737465702d34
const navigationQuery = searchParams.get("navigation");

const instructions = new BatchInstructionDecoder().decode(navigationQuery);
const result = new ActionSelector({
  container: document.body,
  instructions,
  actions: { aliases: { c: "click" } },
}).execute();

console.log(result);
```

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
