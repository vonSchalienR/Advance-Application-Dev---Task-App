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



// CODE FROM CHATGPT, WORKS BUT NEEDS SOME FIXES
import { Stack } from "expo-router";

export default function RootLayout() {

const isAuth = false; // vaihda oikeaan tarkistukseen

  return (

    <Stack>

 {isAuth ? (

    // pääsovelluksen välilehdet

    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

     ) : (

        // kirjautumisnäkymä

       <Stack.Screen name="auth" options={{ headerShown: false }} />

       )}

    </Stack>

 );

} 

// CODE FROM CHATGPT, WORKS BUT NEEDS SOME FIXES


