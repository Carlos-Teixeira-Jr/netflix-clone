//Está é a página dinâmica que mostra cada vídeo individual quando clicamos em algum deles na Home;
//Essa página até poderia ser gerada estaticamente (SSG) pois apenas o viewCount e a feature de like e dislike precisam ser gerados dinâmicamente, porém, essa página tem dois casos de uso (clicando no card e clicando no Banner) e o banner está sempre mudando e por isso não seria possível saber qual video deveria ser pré-renderizado no build-time; No caso do Card poderia ser gerado estáticamente no servidor pois sabemos de antemão quais videos estarão no Card;
//O método de renderização escolhido foi o ISR onde a página será pré-renderizada no servidor e terá atualizações dos dados respeitando um intervalo de tempo especificado. Caso haja alguma alteração nos dados no meio desse intervalo, o primeiro usuário a acessar a página receberá dados desatualizados, mas nesse momento a página será atualizada e no próximo acesso já mostrará os dados corretos ainda que o intervalo de atualização não tenha se concluído [no caso, não é um problema que o viewCount esteja desatualizado, mas dependendo do dado pode ser um problema];

import classNames from "classnames";
import { useRouter } from "next/router";
import Modal from "react-modal";
import styles from "../../styles/Video.module.css";
import clsx from "classnames";
import { getYoutubeVideoById } from "../../lib/videos";
import Navbar from "../../components/nav/navbar";
import Like from "../../components/icons/like.icon";
import DisLike from "../../components/icons/dislike.icons";
import { useState, useEffect } from "react";

Modal.setAppElement("#__next");

//O que houver nessa função será pré-renderizado no lado do servidor;
//O parâmetro context [Next] foi usado para acessar os params da rota dinâmica que é gerada pelos cards qundo clicados;
export async function getStaticProps(context) {

  const videoId = context.params.videoId;
  

  const videoArray = await getYoutubeVideoById(videoId);

  return {
    props: {
      video: videoArray.length > 0 ? videoArray[0] : {},
    },
    //A cada 10 segundos será verificado se há alguma atualização necessária nesses dados e se houver eles serão renderizados no servidor e armazenados em cache via CDN;
    revalidate: 10,
  }
};

//Todos os dados nessa função serão renderizados no servidor estaticamente e estarão disponíveis para essa página;
export async function getStaticPaths() {
  const listOfVideos = ["mYfJxlgR2jw", "4zH5iYM4wJo", "KCPEHsAViiQ"]

  //O params precisa se chamar videoId pois é o nome da página, do contrário ocorrerá um erro;
  const paths = listOfVideos.map((videoId) => ({
    params: { videoId }
  }));

  //Fallback blocking faz com que as páginas que não estiverem no path sejam renderizadas no servidor na primeira requisição e depois fiquem disponiveis em cache [nenhum aviso de Loading é gerado];
  return { paths, fallback: "blocking"}
}

const Video = ({ video }) => {

  const router = useRouter();

  const videoId = router.query.videoId;

  const [toggleLike, setToggleLike] = useState(false);
  const [toggleDisLike, setToggleDisLike] = useState(false);

  //Transforma cadachave do obejeto video em uma variável independente para que seja possível manejá-la com mais facilidade;
  const { 
    title, 
    publishTime, 
    description, 
    channelTitle,
    statistics: { viewCount } = { viewCount: 0 }
  } = video;

  useEffect(() => {
    const handleLikeDislikeService = async () => {
      const response = await fetch(`/api/stats?videoId=${videoId}`, {
        method: "GET",
      });
      const data = await response.json();

      if (data.length > 0) {
        const favourited = data[0].favourited;
        if (favourited === 1) {
          setToggleLike(true);
        } else if (favourited === 0) {
          setToggleDisLike(true);
        }
      }
    };
    handleLikeDislikeService();
  }, [videoId]);

  const runRatingService = async (favourited) => {
    
    return await fetch("/api/stats", {
      method: "POST",
      //Watched não precisou ser passado no corpo da requisição poisseu valor default já estava definido como true na declaração da variável (isso pq não é possível favoritar um video que não tenha sido assistido);
      body: JSON.stringify({
        videoId, 
        favourited,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const handleToggleDisLike = async () => {

    setToggleDisLike(!toggleDisLike);
    setToggleLike(toggleDisLike);

    const val = !toggleDisLike;
    const favourited = val ? 0 : 1;
    const response = await runRatingService(favourited);

  };

  const handleToggleLike = async () => {
    const val = !toggleLike;
    setToggleLike(val);
    setToggleDisLike(toggleLike);

    const favourited = val ? 1 : 0;
    const response = await runRatingService(favourited);
    
    //console.log("data", await response.json());
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <Modal
        className={styles.modal}
        isOpen={true}
        contentLabel="Watch the video"
        onRequestClose={() => router.back()}
        overlayClassName={styles.overlay}
      >
        <iframe 
          id="ytplayer" 
          className={styles.videoPlayer}
          type="text/html"
          width="100%" 
          height="360"
          src={`http://www.youtube.com/embed/${videoId}?autoplay=0&origin=http://example.com&controls=0`}
          frameborder="0"
        ></iframe>

        <div className={styles.likeDislikeBtnWrapper}>
          <div className={styles.likeBtnWrapper}>
            <button onClick={handleToggleLike}>
              <div className={styles.btnWrapper}>
                <Like selected={toggleLike}/>
              </div>
            </button>
          </div>
          
          <button onClick={handleToggleDisLike}>
            <div className={styles.btnWrapper}>
              <DisLike selected={toggleDisLike}/>
            </div>
          </button>
        </div>
        
        
        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishTime}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.col2}>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>Cast: </span>
                <span className={styles.channelTitle}>{channelTitle}</span>
              </p>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>viewCount: </span>
                <span className={styles.channelTitle}>{viewCount}</span>
              </p>
            </div>
          </div>
        </div>

      </Modal>
    </div>
  );
};

export default Video;