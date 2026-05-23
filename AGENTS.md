<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:local-project-rules -->

# Local project rules

- Do not use Figma MCP for this project.
- Do not use the layout-rules-only MCP for this project.

## Code style

- Prefer visually tidy ordering over mechanical alphabetical ordering.
- In named import blocks, put shorter/simple value imports first where practical, then longer names, with `type` imports at the end of the same block.
- Keep import declarations in a readable local order for the file instead of forcing all external imports before local imports. For example, core feature imports may come first, then the module stylesheet, local components, local types/helpers, and remaining UI/framework imports.
- In props and object types, list data fields first, then callbacks and getter functions in the order that reads most naturally for the component.
- In JSX props, keep stable identity/data props first, then behavioral props and flags, then related handlers/getters close to the behavior they configure.
- Do not churn unrelated files only to reorder code, but apply this style to new code and files already being edited.
<!-- END:local-project-rules -->
