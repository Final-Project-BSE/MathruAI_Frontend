// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
const file = 'd:/projects/Final project-6689/be/MathruAI_Frontend/src/components/timeline-milestone/fetal-data.ts';
let content = fs.readFileSync(file, 'utf8');

// Replace standard colors with color + image
content = content.replace(/color: "([^"]+)" \}/g, 'color: "$1", image: "" }');

// Specifically update week 1
content = content.replace(/week: 1,([^]+?)image: "" \}/, 'week: 1,$1image: "/images/auth-bg.png" }');

fs.writeFileSync(file, content, 'utf8');
console.log("Updated fetal-data.ts successfully!");
