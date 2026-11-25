import { promises as fs } from 'fs';
import sanitize from 'sanitize-html';

// Strips pasted styling from the HTML in ./src/packs. Usage: node tools/sanitizeHTML.mjs [--dry-run]

const PACKS_DIR = './src/packs';
const dryRun = process.argv.includes('--dry-run');

const OPTIONS = {
  // Unlisted tags are removed, their content kept.
  allowedTags: [
    'p', 'strong', 'em', 'u', 's', 'sup', 'sub', 'a', 'br', 'hr', 'ul', 'ol', 'li', 'blockquote',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
  ],
  allowedAttributes: { '*': ['style'], a: ['href'], th: ['colspan', 'rowspan'], td: ['colspan', 'rowspan'] },
  allowedStyles: { '*': { 'text-align': [/^(center|right|justify)$/] } },
  transformTags: {
    b: 'strong',
    i: 'em',
    // Bold/italic spans become strong/em.
    span: (tagName, attribs) => {
      const style = (attribs.style ?? '').replace(/\s/g, '').toLowerCase();
      if (/font-weight:(bold|[6-9]00)/.test(style)) return { tagName: 'strong' };
      if (style.includes('font-style:italic')) return { tagName: 'em' };
      return { tagName, attribs };
    },
  },
};

// Drops empty tags and merges adjacent formatting.
const tidy = (html) => html.replace(/<(strong|em|u|s|p)>\s*<\/\1>/g, '').replace(/<\/(strong|em)><\1>/g, '').trim();

// Text only, to verify the wording is unchanged.
const textOf = (html) => sanitize(html, { allowedTags: [] }).replace(/\s+/g, '');

let files = 0;
let fields = 0;

for (const file of await fs.readdir(PACKS_DIR, { recursive: true })) {
  if (!file.endsWith('.json')) continue;
  const filePath = `${PACKS_DIR}/${file}`;
  const source = await fs.readFile(filePath, 'utf8');

  let changes = 0;
  const document = JSON.parse(source, (key, value) => {
    if (typeof value !== 'string' || !/<[a-z]/i.test(value)) return value;
    const clean = tidy(sanitize(value, OPTIONS));
    if (clean === value) return value;
    if (textOf(clean) !== textOf(value)) throw new Error(`Text of "${key}" would change: ${value.slice(0, 80)}`);
    changes++;
    return clean;
  });
  if (!changes) continue;

  files++;
  fields += changes;
  if (!dryRun) await fs.writeFile(filePath, JSON.stringify(document, null, 2) + (source.endsWith('\n') ? '\n' : ''));
}

console.log(`${dryRun ? 'Would sanitize' : 'Sanitized'} ${fields} fields in ${files} files`);
