import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './legal.module.css';

// Minimal, dependency-free Markdown renderer for the legal documents.
// Supports: headings (##–####, with anchor ids), paragraphs, ordered/unordered lists, tables,
// blockquotes, horizontal rules, **bold**, *italic*, `code`, [links](url), email addresses and
// [[decision markers]]. Output is React elements; the only HTML string is the email link below,
// built from a strictly validated, escaped address.

const EMAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const INLINE =
  /(\[\[[^\]]+\]\]|\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\)|\*[^*\s][^*]*\*|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Cloudflare's email obfuscation rewrites addresses in the HTML, which breaks React hydration
 * (error #418, seen on /contact). The email_off markers tell Cloudflare to leave the link alone.
 */
export function EmailLink({ email, className }: { email: string; className?: string }) {
  if (!EMAIL.test(email)) return <>{email}</>;
  const safe = escapeHtml(email);
  const cls = className ? ` class="${escapeHtml(className)}"` : '';
  return (
    <span
      dangerouslySetInnerHTML={{ __html: `<!--email_off--><a${cls} href="mailto:${safe}">${safe}</a><!--/email_off-->` }}
    />
  );
}

export function headingId(text: string): string {
  return text
    .replace(/^\d+\.\s*/, '')
    .toLowerCase()
    .replace(/[`*[\]]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function inline(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let n = 0;
  for (const match of text.matchAll(INLINE)) {
    const token = match[0];
    const start = match.index ?? 0;
    if (start > last) out.push(text.slice(last, start));
    const key = `${keyPrefix}-${n++}`;
    if (token.startsWith('[[')) {
      out.push(<mark key={key} className={styles.placeholder}>{token}</mark>);
    } else if (token.startsWith('**')) {
      out.push(<strong key={key}>{inline(token.slice(2, -2), key)}</strong>);
    } else if (token.startsWith('`')) {
      out.push(<code key={key}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith('[')) {
      const m = token.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
      if (m) {
        const href = m[2];
        out.push(
          href.startsWith('/') && !href.startsWith('/account/')
            ? <Link key={key} href={href}>{m[1]}</Link>
            : <a key={key} href={href} rel={href.startsWith('/') ? undefined : 'noopener noreferrer'}>{m[1]}</a>,
        );
      } else {
        out.push(token);
      }
    } else if (EMAIL.test(token)) {
      out.push(<EmailLink key={key} email={token} />);
    } else if (token.startsWith('*')) {
      out.push(<em key={key}>{inline(token.slice(1, -1), key)}</em>);
    } else {
      out.push(token);
    }
    last = start + token.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function splitRow(line: string): string[] {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
}

export default function LegalMarkdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let i = 0;
  let k = 0;
  let skippedTitle = false;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    const key = `b${k++}`;

    if (!trimmed) { i++; continue; }

    // The document's own H1 duplicates the page title.
    if (/^# /.test(trimmed) && !skippedTitle) { skippedTitle = true; i++; continue; }

    const heading = trimmed.match(/^(#{2,4}) (.*)$/);
    if (heading) {
      const level = heading[1].length;
      const text = inline(heading[2], key);
      const id = headingId(heading[2]);
      blocks.push(
        level === 2 ? <h2 key={key} id={id}>{text}</h2>
          : level === 3 ? <h3 key={key} id={id}>{text}</h3>
            : <h4 key={key} id={id}>{text}</h4>,
      );
      i++;
      continue;
    }

    if (/^---+$/.test(trimmed)) { blocks.push(<hr key={key} />); i++; continue; }

    if (trimmed.startsWith('>')) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quote.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      blocks.push(<blockquote key={key}><p>{inline(quote.join(' '), key)}</p></blockquote>);
      continue;
    }

    if (trimmed.startsWith('|')) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const row = lines[i].trim();
        if (!/^\|[\s:|-]+\|$/.test(row)) rows.push(splitRow(row));
        i++;
      }
      const [head, ...body] = rows;
      blocks.push(
        <div key={key} className={styles.tableWrap} role="region" aria-label="Table" tabIndex={0}>
          <table>
            <thead><tr>{head.map((c, j) => <th key={j} scope="col">{inline(c, `${key}h${j}`)}</th>)}</tr></thead>
            <tbody>
              {body.map((r, ri) => (
                <tr key={ri}>{r.map((c, j) => <td key={j}>{inline(c, `${key}r${ri}c${j}`)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    if (/^[-*] /.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*] /, ''));
        i++;
      }
      blocks.push(<ul key={key}>{items.map((t, j) => <li key={j}>{inline(t, `${key}${j}`)}</li>)}</ul>);
      continue;
    }

    if (/^\d+\. /.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\. /, ''));
        i++;
      }
      blocks.push(<ol key={key}>{items.map((t, j) => <li key={j}>{inline(t, `${key}${j}`)}</li>)}</ol>);
      continue;
    }

    // Paragraph: consecutive lines. A line ending in two spaces, or a "**Label:**" line, starts a new line.
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,4} |>|\||[-*] |\d+\. |---+$)/.test(lines[i].trim())
    ) {
      para.push(lines[i].trim());
      i++;
    }
    const parts: ReactNode[] = [];
    para.forEach((p, j) => {
      if (j > 0) parts.push(/^\*\*[^*]+:\*\*/.test(p) ? <br key={`${key}br${j}`} /> : ' ');
      parts.push(...inline(p, `${key}p${j}`));
    });
    blocks.push(<p key={key}>{parts}</p>);
  }

  return <div className={styles.prose}>{blocks}</div>;
}
