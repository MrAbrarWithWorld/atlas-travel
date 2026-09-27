import { NICHES, NicheView, nicheMetadata } from '../NichePage';

export const metadata = nicheMetadata(NICHES.bookkeepers);

export default function Page() {
  return <NicheView data={NICHES.bookkeepers} />;
}
