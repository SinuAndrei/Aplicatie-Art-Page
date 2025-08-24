import styles from '@/styles/page.module.css';

export default function InfoContainer({ type, image, desc }) {
  const text = [
    `[Artistul] este un creator dedicat, format într-un mediu artistic care i-a conturat atât tehnica, cât și sensibilitatea față de estetică. Studiile sale au început la o școală locală de arte, unde și-a descoperit pasiunea pentru [specific artistic, ex: pictură, sculptură, fotografie]. Dorința de a se perfecționa l-a condus către o academie prestigioasă, [numele instituției sau loc general, ex: Academia de Arte Frumoase din Paris], unde a aprofundat stiluri clasice și moderne, integrând diverse influențe în propriile lucrări.
  
    De-a lungul carierei, [artistul] a colaborat cu galerii și ateliere renumite, lucrând alături de maeștri ai artei contemporane. Viața sa a fost o combinație între căutare interioară și explorare exterioară, călătorind în locuri precum [locuri importante], care i-au oferit inspirație și o viziune globală asupra artei.`,
    `Pentru [artist], arta nu este doar o formă de expresie, ci un mod de a conecta sufletele și de a explora esența existenței umane. Consideră că fiecare lucrare este o poveste nespusă, o oglindire a emoțiilor și experiențelor universale. Arta nu trebuie doar să fie privită, ci și simțită, deoarece ea vorbește direct inimii, fără a necesita traduceri.
  
    În viziunea sa, arta are puterea de a transcende barierele culturale și lingvistice, fiind un limbaj pur al umanității. Crede cu tărie că rolul artistului este acela de a dezvălui adevăruri ascunse, de a provoca gândirea și de a oferi un refugiu estetic într-o lume adesea haotică.`,
  ];

  return (
    <div
      className={`${styles.infoContainer} ${
        type === 'left' ? styles.left : styles.right
      }`}
    >
      <img
        src={`${process.env.NEXT_PUBLIC_CLOUDINARY_URL}/${image}?cache_control=public,max-age=31536000,immutable`}
        alt="Missing image"
        width="960"
        height="600"
      />
      <div className={styles.desc}>
        <span>{desc}</span>
        <p>{type === 'right' ? text[0] : text[1]}</p>
      </div>
    </div>
  );
}
