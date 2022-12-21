import Head from "next/head";
import Navbar from "../../components/nav/navbar";
import SectionCards from "../../components/card/section-card";
import styles from "../../styles/MyList.module.css";
import { getMyList } from "../../lib/videos";
import redirectUser from "../../utils/redirectUser";

export async function getServerSideProps(context){

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

  const videos = await getMyList(userId, token);

  return {
    props: {
      myListVideos: videos,
    },
  };
}

const MyList = ({ myListVideos }) => {
  return <div>
    <Head>
      <title>My list</title>
    </Head>
    <main className={styles.main}>
      <Navbar />
      <div className={styles.sectionWrapper}>
        <SectionCards 
        title="My List" 
        videos={myListVideos} 
        size="small"
        shouldWrap
        shoulScale={false}
      />
      </div>
      
    </main>
  </div>
}
export default MyList;