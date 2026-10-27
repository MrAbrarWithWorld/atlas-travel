import { NICHES, NicheView, nicheMetadata } from '../NichePage';

export const metadata = nicheMetadata(NICHES['property-managers']);

export default function Page() {
  return <NicheView data={NICHES['property-managers']} />;
}
