import fs from 'fs';

let content = fs.readFileSync('app/page.tsx', 'utf-8');

// Also filter client-side just to be 100% absolutely safe that it never renders a server.
content = content.replace(
  '{data.hits.map((project, index) => (',
  '{data.hits.filter((p) => p.project_type !== "server").map((project, index) => ('
);

fs.writeFileSync('app/page.tsx', content);
