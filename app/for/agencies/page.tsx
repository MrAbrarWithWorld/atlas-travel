import { NICHES, NicheView, nicheMetadata } from '../NichePage';

export const metadata = nicheMetadata(NICHES.agencies);

export default function Page() {
  return <NicheView data={NICHES.agencies} />;
}
