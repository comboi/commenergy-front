import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '../../../../components/ui/separator';

const AddNewContract = () => {
  return (
    <Card>
      <CardHeader title="Coeficients" />
      Coeficients
      <CardContent>
        April
        <Separator />
        <div>Test 1</div> <div>Date: 01/12/2023</div>{' '}
        <div className="underline">Link</div>
      </CardContent>
    </Card>
  );
};

export default AddNewContract;
