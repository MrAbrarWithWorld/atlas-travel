import { AreaView, areaMetadata } from '../AreaPage';

export const metadata = areaMetadata('brampton');

export default function Page() {
  return <AreaView slug="brampton" />;
}
