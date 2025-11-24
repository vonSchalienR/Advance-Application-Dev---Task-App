
// mulla ei toimi ilman tätä, sekä se näyttää hiukan erilaiselta tottakai sen takia. 
// Kokeile sä toimiiko sulla sillä vanhalla eli tällä

/*import { Stack, useRouter } from "expo-router"; 
import { useEffect } from "react"; function RouteGuard({ children }: { children: React.ReactNode }) { const router = useRouter(); const isAuth = false; useEffect(() => { if (!isAuth) { router.replace("/auth"); } }); return <>{children}</> }
export default function RootLayout() { return ( <RouteGuard> <Stack> <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> </Stack> </RouteGuard> ); } 
*/



//GPT ANTAMA KOODI:
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
