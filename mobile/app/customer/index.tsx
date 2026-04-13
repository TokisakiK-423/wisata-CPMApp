import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function CustomerIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/customer/tabs');
  }, []);

  return null;
}
