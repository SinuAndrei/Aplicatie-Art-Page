import styles from '@/styles/bio.module.css';

export default function Bio() {
  return (
    <div className={styles.bio}>
      <div className={styles.bioTitleContainer}>
        <h1 className={`${styles.bioTitleH1} ${styles.underline}`}>Bio</h1>
      </div>
      <div className={styles.bioContent}>
        <p>My name is John Doe and I am a contemporary artist.</p>
        <p>
          I have been creating art for over 15 years, exploring various mediums
          such as painting, sculpture, and digital art. My work often reflects
          themes of nature, human emotion, and the intersection of technology
          and society.
        </p>
        <p>
          I have exhibited my work in numerous galleries and museums around the
          world, including the Museum of Modern Art in New York, the Tate Modern
          in London, and the Centre Pompidou in Paris.
        </p>
        <p>
          My artistic journey began with a fascination for colors and shapes,
          which led me to pursue a degree in Fine Arts. Over the years, I have
          developed a unique style that blends realism with abstract elements,
          creating visually striking and thought-provoking pieces.
        </p>
      </div>
      <div className={styles.bioTitleContainer}>
        <h2 className={`${styles.bioTitleH2} ${styles.underline}`}>
          Selected Exhibitions
        </h2>
      </div>
      <div className={styles.bioContent}>
        <ul>
          <li>
            2020: "Nature's Echo" - Organized by the Art Institute of Chicago,
            Chicago, IL
          </li>
          <li>
            2018: "Digital Dreams" - Curated by the Museum of Modern Art, New
            York, NY
          </li>
          <li>
            2016: "Abstract Realities" - Hosted by the Tate Modern, London, UK
          </li>
          <li>
            2014: "Emotional Landscapes" - Presented by the Centre Pompidou,
            Paris, France
          </li>
          <li>
            2012:"Technological Visions" - Organized by the Guggenheim Museum,
            Bilbao, Spain
          </li>
        </ul>
      </div>
    </div>
  );
}
