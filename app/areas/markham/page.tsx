import { AreaView, areaMetadata } from '../AreaPage';

export const metadata = areaMetadata('markham');

export default function Page() {
  return <AreaView slug="markham" />;
}
