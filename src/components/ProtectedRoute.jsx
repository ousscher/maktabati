// import { useEffect } from 'react';
// import { useRouter } from 'next/router';
// import { useAuth } from '../contexts/AuthContext';

// export default function ProtectedRoute({ children }) {
//   const { user } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!user) {
//       router.push('/login');
//     }
//   }, [user, router]);

//   return user ? children : null;
// }