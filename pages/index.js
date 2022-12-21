import Head from 'next/head'
import styles from '../styles/Home.module.css';
import Banner from "../components/banner/banner";
import Navbar from "../components/nav/navbar";
import SectionCards from '../components/card/section-card';
import { getPopularVideos, getVideos, getWatchItAgainVideos } from '../lib/videos';
import { verifyToken } from '../lib/utils';
import redirectUser from '../utils/redirectUser';

export async function getServerSideProps(context) {

  const { userId, token } = await redirectUser(context);

  if (!userId) {
    return {
      props: {},
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const watchItAgainVideos = await getWatchItAgainVideos(userId, token);

  const disneyVideos = await getVideos("disney%20trailer");
  const productivityVideos = await getVideos("productivity");
  const travelVideos = await getVideos("travel");
  const popularVideos = await getPopularVideos();

  return { props: { 
    disneyVideos, 
    travelVideos, 
    productivityVideos, 
    popularVideos, 
    watchItAgainVideos 
  }};
}

export default function Home({ 
    disneyVideos, 
    travelVideos, 
    productivityVideos,
    popularVideos,
    watchItAgainVideos = []
  }) {

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <Navbar username="carlos.teixeira@trygon.com.br"/>

        <Banner
          videoId="4zH5iYM4wJo"
          title="Clifford the red dog"
          subTitle="A very cute dog"
          imgUrl ="/static/clifford.webp"
        />

        <div className={styles.sectionWrapper}>
          <SectionCards key={disneyVideos.id} title="Disney" videos={disneyVideos} size="large"/>
          <SectionCards key={watchItAgainVideos.id} title="Watch it again" videos={watchItAgainVideos} size="small"/>
          <SectionCards key={travelVideos.id} title="Travel" videos={travelVideos} size="small"/>
          <SectionCards key={productivityVideos.id} title="Productivity" videos={productivityVideos} size="medium"/>
          <SectionCards key={popularVideos.id} title="Popular" videos={popularVideos} size="small"/>
        </div>
      </div>
    </div>
  );
}
