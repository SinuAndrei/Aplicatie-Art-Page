import InfoContainer from '../../components/home/infoContainer';
import Link from 'next/link';
import styles from '@/styles/page.module.css';

export default function Home() {
  const frameLeftImg = 'others/mju7bgty8vrbytsisvmv';
  const frameRightImg = 'others/tbtt153qmmlluveowial';
  return (
    <>
      <InfoContainer
        type={'right'}
        desc={'Artist'}
        image={frameLeftImg}
      ></InfoContainer>
      <div className={styles.divWhite}></div>
      <InfoContainer
        type={'left'}
        desc={'Vision'}
        image={frameRightImg}
      ></InfoContainer>
      <Link href="/bio" className={styles.bio}>
        Read more
      </Link>
    </>
  );
}
