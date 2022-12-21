import '../styles/globals.css';
import { useEffect } from 'react';
import { magic } from '../lib/magic-client';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Loading from '../components/loading/loading';

function MyApp({ Component, pageProps }) {

  //console.log("api key", process.env.YOUTUBE_API_KEY);

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleLoggedIn = async () => {
      const isLoggedIn = await magic.user.isLoggedIn();
      if (isLoggedIn) {
        // route to /
        router.push("/");
      } else {
        // route to /login
        router.push("/login");
      }
    };
    handleLoggedIn();
  }, []);


  //Effect que lida com o delay entre a mensagem de Loading e a renderização da dashboard após o log in;
  useEffect(() => {

    const handleComplete = () => {
      setIsLoading(false)
    }

    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  },[router]);

  //Mostra a msg de loading até que a página de login esteja carregada;
  return isLoading ? <Loading /> : <Component {...pageProps} />
}

export default MyApp
