/* ORIGINAL CODE FROM THE TUTORIAL, NOT WORKING FOR SOME REASON

import { Stack, useRouter } from "expo-router"; 
import { useEffect } from "react";

function RouteGuard({ children }: { children: React.ReactNode }) {
   const router = useRouter();
   const isAuth = false;
   
   useEffect(() => {
      if (!isAuth) {
         router.replace("/auth");
      }
   });
   
   return <>{children}</>
}

export default function RootLayout() {
   return (
   <RouteGuard>
      <Stack>
         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
         </Stack>
         </RouteGuard>
         );
      } 

ORIGINAL CODE FROM THE TUTORIAL, NOT WORKING FOR SOME REASON */ 



// CODE FROM CHATGPT, WORKS NOW

import { Stack } from "expo-router";

export default function RootLayout() {
  return (
   // <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        {/* tänne myöhemmin esim. auth-näkymä erikseen jos haluat */}
        {/* <Stack.Screen name="auth" /> */}
      </Stack>
    // <AuthProvider>
  );
}



// CODE FROM CHATGPT, WORKS NOW


