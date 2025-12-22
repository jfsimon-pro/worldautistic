'use client';

// BlueButton is now an alias for DefaultButton
// Both use the same World Autistic yellow button styling
import DefaultButton from './DefaultButton';

export default function BlueButton(props: any) {
  return <DefaultButton {...props} />;
}
