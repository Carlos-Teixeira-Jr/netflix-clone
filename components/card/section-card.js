import Card from "./card";
import styles from "./section-card.module.css";
import Link from "next/link";
import clsx from "classnames";

const SectionCards = (props) => {

  const { title, videos = [], size, shouldWrap = false, shoudlScale } = props;

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={clsx(styles.cardWrapper, shouldWrap && styles.wrap)}>
        {videos.map((video, idx) => {
          return (
            <Link key={video.id} href={`/video/${video.id}`} legacyBehavior>
              <a>
                <Card 
                  key={video.id}
                  id={idx} 
                  imgUrl={video.imgUrl} 
                  size={size}
                  shoudlScale={shoudlScale}
                />
              </a>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default SectionCards;