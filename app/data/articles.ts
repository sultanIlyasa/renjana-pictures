import type { SiteLanguage } from "../components/content";

export type ArticleEntry = {
  slug: string;
  image: string;
  alt: string;
  date: string;
  title: string;
  body: string;
  caption: string;
  cta: string;
  language: SiteLanguage;
  deck: string;
  paragraphs: string[];
};

const clientArticleImages = {
  pln: "/pln/IMG-20251218-WA0002.jpg",
  kemensos: "/Kemensos/kunjungan%20Sekolah%20Rakyat%20Mensos.jpeg",
  posind: "/Posind/IMG-20251210-WA0301.jpg",
};

const idArticles: ArticleEntry[] = [
  {
    slug: "pln-energi-layanan-publik",
    image: clientArticleImages.pln,
    alt: "Dokumentasi kegiatan PLN",
    date: "PLN / Dokumentasi",
    title: "PLN: menjaga energi layanan publik tetap terasa dekat.",
    body: "Catatan produksi tentang membingkai kerja lapangan, ritme layanan, dan wajah yang membuat infrastruktur terasa manusiawi.",
    caption: "Dokumentasi PLN: energi, layanan, dan kedekatan publik.",
    cta: "Baca artikel",
    language: "id",
    deck: "PLN bukan hanya tentang jaringan dan pasokan listrik. Dalam frame produksi, energinya juga muncul dari orang-orang yang menjaga layanan tetap bergerak.",
    paragraphs: [
      "Artikel ini membaca PLN dari sudut produksi visual: bagaimana aktivitas lapangan, koordinasi tim, dan detail layanan bisa diterjemahkan menjadi cerita yang terasa dekat. Kamera tidak hanya mengejar skala infrastruktur, tetapi juga momen kecil yang membuat kerja besar itu mudah dipahami.",
      "Pendekatannya adalah menjaga ritme dokumentasi tetap rapi. Setiap frame perlu memberi konteks: siapa yang bekerja, apa yang sedang dijaga, dan bagaimana layanan itu berdampak pada ruang publik. Dengan begitu, visual PLN tidak berhenti sebagai dokumentasi kegiatan, tetapi menjadi gambaran tentang keandalan.",
      "Untuk kebutuhan brand, jenis cerita seperti ini membantu audiens melihat energi sebagai pengalaman sehari-hari. Gambar lapangan, wajah tim, dan detail operasional menjadi satu alur yang memperlihatkan bahwa layanan publik selalu punya sisi manusia.",
    ],
  },
  {
    slug: "kemensos-sekolah-rakyat",
    image: clientArticleImages.kemensos,
    alt: "Kunjungan Kemensos ke Sekolah Rakyat",
    date: "Kemensos / Sekolah Rakyat",
    title: "Kemensos: membaca harapan dari ruang Sekolah Rakyat.",
    body: "Cerita visual tentang kunjungan, interaksi, dan ruang pendidikan yang membawa pesan sosial secara hangat.",
    caption: "Kunjungan Sekolah Rakyat: ruang belajar, perhatian, dan harapan.",
    cta: "Baca artikel",
    language: "id",
    deck: "Kunjungan Kemensos ke Sekolah Rakyat membutuhkan bahasa visual yang hangat: cukup dekat untuk menangkap emosi, cukup tertata untuk menjaga pesan institusional.",
    paragraphs: [
      "Dalam dokumentasi sosial, kamera harus bekerja dengan empati. Fokusnya bukan hanya siapa yang hadir, tetapi apa yang terjadi di antara orang-orang: sapaan, perhatian, percakapan singkat, dan suasana ruang belajar yang memberi konteks pada program.",
      "Sekolah Rakyat memberi materi visual yang kuat karena ia mempertemukan kebijakan dengan wajah penerima manfaat. Produksi perlu menjaga agar setiap gambar terasa natural, tidak berjarak, dan tetap mampu menjelaskan nilai program kepada audiens yang lebih luas.",
      "Hasil akhirnya adalah cerita yang tidak hanya mencatat kegiatan, tetapi juga memperlihatkan arah: pendidikan, pendampingan, dan harapan yang sedang dibangun. Di sinilah dokumentasi menjadi lebih dari arsip, yaitu menjadi ingatan visual.",
    ],
  },
  {
    slug: "posind-logistik-bergerak",
    image: clientArticleImages.posind,
    alt: "Dokumentasi kegiatan PosIND",
    date: "PosIND / Aktivasi",
    title: "PosIND: logistik yang bergerak dengan wajah manusia.",
    body: "Produksi visual untuk memperlihatkan pergerakan layanan, titik temu pelanggan, dan energi operasional Pos Indonesia.",
    caption: "PosIND: pergerakan layanan dan ritme operasional.",
    cta: "Baca artikel",
    language: "id",
    deck: "PosIND memiliki kekuatan visual pada pergerakan: paket, layanan, manusia, dan titik distribusi yang terus hidup dari satu tempat ke tempat lain.",
    paragraphs: [
      "Cerita logistik mudah terlihat teknis jika hanya berisi kendaraan, paket, dan alur distribusi. Karena itu, pendekatan visual perlu memasukkan wajah manusia: petugas, pelanggan, interaksi, dan detail yang membuat layanan terasa dekat.",
      "Frame yang kuat untuk PosIND adalah frame yang punya arah. Ada perpindahan, ada ritme operasional, dan ada momen pelayanan yang memberi alasan emosional pada sistem yang besar. Produksi perlu menjaga gerak itu tetap terbaca tanpa membuat visual terasa terlalu ramai.",
      "Dengan komposisi yang tepat, PosIND dapat tampil sebagai brand layanan yang aktif, adaptif, dan relevan. Logistik bukan hanya tentang sampai tujuan, tetapi tentang kepercayaan yang dibangun di setiap titik perjalanan.",
    ],
  },
];

const enArticles: ArticleEntry[] = [
  {
    slug: "pln-public-service-energy",
    image: clientArticleImages.pln,
    alt: "PLN activity documentation",
    date: "PLN / Documentation",
    title: "PLN: making public-service energy feel close.",
    body: "A production note on field work, service rhythm, and the people who make infrastructure feel human.",
    caption: "PLN documentation: energy, service, and public proximity.",
    cta: "Read article",
    language: "en",
    deck: "PLN is not only about grids and power supply. On camera, its energy also comes from the people who keep public service moving.",
    paragraphs: [
      "This article looks at PLN through a production lens: how field activity, team coordination, and service details can become a story that feels close. The camera does not only chase the scale of infrastructure; it also looks for small moments that make large work easier to understand.",
      "The visual approach keeps the documentation disciplined. Every frame should give context: who is working, what is being maintained, and how the service touches public space. That way, PLN's visuals become more than activity records; they become a picture of reliability.",
      "For brand communication, this type of story helps audiences see energy as a daily experience. Field images, team presence, and operational detail come together to show that public service always has a human side.",
    ],
  },
  {
    slug: "kemensos-sekolah-rakyat-visit",
    image: clientArticleImages.kemensos,
    alt: "Kemensos visit to Sekolah Rakyat",
    date: "Kemensos / Sekolah Rakyat",
    title: "Kemensos: reading hope inside Sekolah Rakyat.",
    body: "A visual story about visits, interaction, and education spaces that carry a social message warmly.",
    caption: "Sekolah Rakyat visit: learning space, care, and hope.",
    cta: "Read article",
    language: "en",
    deck: "A Kemensos visit to Sekolah Rakyat needs a warm visual language: close enough to capture emotion, composed enough to carry the institutional message.",
    paragraphs: [
      "In social documentation, the camera has to work with empathy. The focus is not only who attended, but what happened between people: greetings, attention, short conversations, and the learning environment that gives the program context.",
      "Sekolah Rakyat gives strong visual material because it connects policy with the faces of its beneficiaries. Production needs to keep each image natural, close, and still able to explain the program's value to a wider audience.",
      "The final story should do more than record an event. It should show direction: education, support, and the hope being built. This is where documentation becomes more than archive; it becomes visual memory.",
    ],
  },
  {
    slug: "posind-human-logistics",
    image: clientArticleImages.posind,
    alt: "PosIND activity documentation",
    date: "PosIND / Activation",
    title: "PosIND: logistics in motion with a human face.",
    body: "Visual production that shows service movement, customer touchpoints, and the operational energy of Pos Indonesia.",
    caption: "PosIND: service movement and operational rhythm.",
    cta: "Read article",
    language: "en",
    deck: "PosIND has visual strength in movement: parcels, service, people, and distribution points that stay alive from one place to another.",
    paragraphs: [
      "A logistics story can feel overly technical when it only shows vehicles, parcels, and distribution flow. The visual approach needs people in the frame: officers, customers, interaction, and details that make the service feel close.",
      "A strong PosIND frame has direction. There is movement, operational rhythm, and a service moment that gives emotional reason to a large system. Production has to keep that motion readable without making the visual feel crowded.",
      "With the right composition, PosIND can appear as an active, adaptive, and relevant service brand. Logistics is not only about arriving at the destination; it is about trust built at every point of the journey.",
    ],
  },
];

export const ARTICLES_BY_LANGUAGE: Record<SiteLanguage, ArticleEntry[]> = {
  id: idArticles,
  en: enArticles,
};

export const ALL_ARTICLES = [...idArticles, ...enArticles];

export function getArticleBySlug(slug: string) {
  return ALL_ARTICLES.find((article) => article.slug === slug);
}

export function getSlugForArticleTitle(title: string) {
  return ALL_ARTICLES.find((article) => article.title === title)?.slug ?? "template";
}

export function getRelatedArticles(article: ArticleEntry, count = 4) {
  return ARTICLES_BY_LANGUAGE[article.language]
    .filter((item) => item.slug !== article.slug)
    .slice(0, count);
}
