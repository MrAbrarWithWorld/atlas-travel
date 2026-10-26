// Static list of the Travel Planner legal document versions, built at deploy time.
// Read by lib/legal-notice.js to email account holders automatically when a version changes.
import { listLegalDocs } from '../content';

export const dynamic = 'force-static';

export function GET() {
  const docs = listLegalDocs('travel')
    .filter((d) => d.status === 'in-effect')
    .map((d) => ({
      set: d.set,
      slug: d.slug,
      title: d.title,
      shortTitle: d.shortTitle,
      version: d.version,
      noticeVersion: d.noticeVersion,
      effective: d.effective,
      url: `https://getatlas.ca${d.url}`,
      notice: d.notice,
    }));
  return Response.json({ docs });
}
