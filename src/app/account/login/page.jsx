import { Suspense } from 'react';
import CustomerLoginScreen from './CustomerLoginScreen';

export const metadata = {
  title: 'Login',
  description: 'Log in with your mobile number and OTP to track orders and checkout faster.',
  robots: { index: false, follow: true },
};

export default function CustomerLoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            background: '#ffffff',
            color: '#000000',
          }}
        >
          Loading…
        </div>
      }
    >
      <CustomerLoginScreen />
    </Suspense>
  );
}
