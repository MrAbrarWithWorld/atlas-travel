import { NICHES, NicheView, nicheMetadata } from '../NichePage';

export const metadata = nicheMetadata(NICHES.realtors);

export default function Page() {
  return <NicheView data={NICHES.realtors} />;
}
