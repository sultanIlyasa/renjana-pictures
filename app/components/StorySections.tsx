"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ARTICLES_BY_LANGUAGE, getSlugForArticleTitle } from "../data/articles";
import type {
  ContactDetails,
  StoryContent,
  StoryCopy,
} from "../data/siteContent";
import type { SiteLanguage } from "./content";
import styles from "./StorySections.module.css";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const ARTICLE_LOOP_COPY_COUNT = 5;
const ARTICLE_LOOP_START_COPY = 2;

const CONTACT_DETAILS: ContactDetails = {
  phoneDisplay: "0878-8210-0888",
  phoneHref: "tel:+6287882100888",
  email: "masayurenjana@gmail.com",
  emailHref: "mailto:masayurenjana@gmail.com",
  mapsUrl: "https://maps.app.goo.gl/ruMos1gTXsFq9Wx67",
};

const STORY_COPY: Record<SiteLanguage, StoryCopy> = {
  id: {
    servicesCredit: "Bukan vendor produksi",
    servicesTitle: "Tiga cara kerja, satu rasa yang sama.",
    servicesLead:
      "Renjana membantu brief bergerak dari ide, pengambilan gambar, sampai master final tanpa kehilangan alasan emosionalnya.",
    services: [
      {
        label: "Siaran",
        title: "Sinyal tetap jernih saat ruangan bergerak cepat.",
        body: "Liputan live, peluncuran, interview room, multi-camera coverage, dan edit siaran yang disiapkan untuk tempo lapangan.",
        details: ["Multi-kamera", "Event film", "Paket siaran"],
      },
      {
        label: "Film",
        title: "Visual yang memberi ruang untuk rasa.",
        body: "Brand film, campaign narrative, product reel, dan treatment visual yang dibentuk sejak konsep, bukan hanya saat edit.",
        details: ["Treatment", "Produksi", "Penyutradaraan"],
      },
      {
        label: "Iklan",
        title: "Potongan komersial yang singkat tapi menempel.",
        body: "TVC, cutdown sosial, motion graphic, sound, color, dan delivery master untuk kampanye yang harus cepat hidup.",
        details: ["TVC", "Cutdown", "Post production"],
      },
    ],
    reelCredit: "Reel strip YouTube",
    reelTitle: "Showcase yang bisa terus berputar.",
    reelBody:
      "Carousel ini memakai embed YouTube agar daftar karya bisa diganti dengan link final dari kanal klien tanpa mengubah layout.",
    reelSkip: "Lewati reel",
    reelPrev: "Reel sebelumnya",
    reelNext: "Reel berikutnya",
    reels: [
      {
        youtubeId: "aqz-KE-bpKQ",
        label: "Brand film",
        title: "Ember & Oath",
        body: "Dunia kampanye yang dibangun dari panas, tekstur, dan ritme ritual.",
      },
      {
        youtubeId: "LXb3EKWsInQ",
        label: "TVC",
        title: "Cloudburst",
        body: "Cerita produk berbasis cuaca dengan tempo studio yang terkontrol.",
      },
      {
        youtubeId: "M7lc1UVf-VE",
        label: "Company profile",
        title: "Golden Hour",
        body: "Lokasi, cahaya, dan edit yang memberi ruang pada atmosfer brand.",
      },
      {
        youtubeId: "ScMzIvxBSi4",
        label: "Launch film",
        title: "Signal Room",
        body: "Placeholder reel untuk film peluncuran dengan ritme presentasi besar.",
      },
      {
        youtubeId: "ysz5S6PUM-U",
        label: "Behind the scenes",
        title: "Studio Floor",
        body: "Placeholder dokumentasi proses produksi, kru, dan keputusan visual.",
      },
      {
        youtubeId: "YE7VzlLtp-4",
        label: "Tourism spot",
        title: "North Coast",
        body: "Placeholder mood destinasi dengan pacing yang lebih tenang dan luas.",
      },
      {
        youtubeId: "jNQXAC9IVRw",
        label: "Archive",
        title: "First Upload",
        body: "Placeholder arsip pendek untuk variasi tekstur pada shelf reel.",
      },
      {
        youtubeId: "dQw4w9WgXcQ",
        label: "Music spot",
        title: "Neon Cut",
        body: "Placeholder video musik untuk melihat perilaku embed dan layout.",
      },
      {
        youtubeId: "hTWKbfoikeg",
        label: "Concert film",
        title: "Stage Pulse",
        body: "Placeholder energi panggung, cahaya, crowd, dan cut cepat.",
      },
      {
        youtubeId: "9bZkp7q19f0",
        label: "Pop campaign",
        title: "Mass Appeal",
        body: "Placeholder kampanye populer untuk mengetes thumbnail yang ramai.",
      },
      {
        youtubeId: "fJ9rUzIMcZQ",
        label: "Anthem film",
        title: "Long Take",
        body: "Placeholder video berdurasi panjang dengan struktur yang ikonik.",
      },
      {
        youtubeId: "ktvTqknDobU",
        label: "Performance",
        title: "Black Stage",
        body: "Placeholder performance untuk kontras panggung gelap dan close-up.",
      },
      {
        youtubeId: "3JZ_D3ELwOQ",
        label: "Motion package",
        title: "Graphic Beat",
        body: "Placeholder motion-heavy untuk memeriksa komposisi kartu kecil.",
      },
    ],
    statsCredit: "Tenang di produksi",
    statsTitle: "Visualnya atmosferik. Delivery-nya tetap presisi.",
    stats: [
      { value: 48, suffix: "h", label: "arah editorial pertama" },
      { value: 12, suffix: "+", label: "format turunan kampanye" },
      { value: 4, suffix: "K", label: "master siap tayang" },
      { value: 30, suffix: "s", label: "hero spot cutdown" },
    ],
    testimonialCredit: "Kata partner",
    testimonialTitle: "Catatan produksi dalam gambar.",
    testimonials: [
      {
        image: "/work/flame.jpg",
        alt: "Frame hangat dari produksi kampanye",
        eyebrow: "Artikel placeholder",
        title: "Membaca warna sebelum kamera bergerak.",
        body:
          "Placeholder artikel pendek tentang bagaimana look, wardrobe, dan blocking dipakai untuk membangun rasa kampanye.",
        caption: "Caption gambar: referensi frame hangat untuk artikel kampanye.",
      },
      {
        image: "/work/rain.jpg",
        alt: "Frame hujan dari produksi iklan",
        eyebrow: "Artikel placeholder",
        title: "Saat cuaca menjadi bahasa visual.",
        body:
          "Placeholder artikel tentang ritme produksi, detail air, dan cara membuat suasana tetap terbaca di layar.",
        caption: "Caption gambar: placeholder mood hujan untuk artikel TVC.",
      },
      {
        image: "/work/water.jpg",
        alt: "Frame air dari reel produk",
        eyebrow: "Artikel placeholder",
        title: "Detail kecil yang membuat produk terasa mahal.",
        body:
          "Placeholder artikel tentang macro movement, tekstur, dan pacing untuk membuat produk terasa lebih bernilai.",
        caption: "Caption gambar: placeholder tekstur air untuk artikel produk.",
      },
    ],
    articleCredit: "Catatan produksi",
    articleTitle: "Artikel yang terasa seperti memori dari lapangan.",
    articlePrev: "Artikel sebelumnya",
    articleNext: "Artikel berikutnya",
    articles: [
      {
        image: "/work/flame.jpg",
        alt: "Frame api dari produksi kampanye",
        date: "Catatan 01",
        title: "Frame pertama sering menentukan rasa seluruh edit.",
        body: "Cara Renjana membaca pembuka, tempo, dan arah mata sebelum timeline mulai penuh.",
        caption: "Placeholder frame kampanye / hangat",
        cta: "Baca catatan",
      },
      {
        image: "/work/rain.jpg",
        alt: "Frame hujan dari produksi iklan",
        date: "Catatan 02",
        title: "Membuat liputan live tetap terasa tersusun.",
        body: "Broadcast adalah koreografi antara kamera, komunikasi, backup, dan sinyal akhir yang bersih.",
        caption: "Placeholder frame TVC / hujan",
        cta: "Lihat proses",
      },
      {
        image: "/work/water.jpg",
        alt: "Frame air dari reel produk",
        date: "Catatan 03",
        title: "Cutdown yang baik sudah dirancang sejak master film.",
        body: "Satu film utama harus tahu bagaimana ia akan berubah menjadi beberapa versi yang lebih tajam.",
        caption: "Placeholder frame produk / macro",
        cta: "Pelajari ritme",
      },
      {
        image: "/work/smoke.jpg",
        alt: "Frame asap dari produksi fashion",
        date: "Catatan 04",
        title: "Asap, bayangan, dan cara memberi tepi pada campaign.",
        body: "Placeholder artikel tentang bagaimana atmosfer gelap dipakai tanpa menenggelamkan produk.",
        caption: "Placeholder frame fashion / smoke",
        cta: "Baca mood",
      },
      {
        image: "/work/sunset.jpg",
        alt: "Frame sunset dari produksi lokasi",
        date: "Catatan 05",
        title: "Golden hour bukan hanya cantik, tapi disiplin waktu.",
        body: "Placeholder artikel tentang keputusan lokasi, blocking, dan jadwal shoot di cahaya pendek.",
        caption: "Placeholder frame lokasi / golden hour",
        cta: "Lihat catatan",
      },
      {
        image: "/work/flame.jpg",
        alt: "Detail api untuk artikel color grading",
        date: "Catatan 06",
        title: "Color grading sebagai arah emosi, bukan filter.",
        body: "Placeholder artikel tentang menjaga warna tetap punya fungsi cerita di setiap format turunan.",
        caption: "Placeholder artikel color / flame",
        cta: "Baca warna",
      },
      {
        image: "/work/rain.jpg",
        alt: "Detail air untuk artikel sound design",
        date: "Catatan 07",
        title: "Sound design membuat gambar terasa lebih dekat.",
        body: "Placeholder artikel tentang detail suara kecil yang membuat frame lebih hidup.",
        caption: "Placeholder artikel sound / rain",
        cta: "Dengar proses",
      },
      {
        image: "/work/water.jpg",
        alt: "Tekstur air untuk artikel produk",
        date: "Catatan 08",
        title: "Product reel butuh tekstur, bukan hanya packshot.",
        body: "Placeholder artikel tentang menambah rasa material pada produk yang diam.",
        caption: "Placeholder artikel texture / water",
        cta: "Baca detail",
      },
      {
        image: "/work/smoke.jpg",
        alt: "Frame asap untuk artikel lighting",
        date: "Catatan 09",
        title: "Lighting yang baik memberi ruang pada bentuk.",
        body: "Placeholder artikel tentang key light, negative fill, dan kontrol kontras di studio.",
        caption: "Placeholder artikel lighting / smoke",
        cta: "Lihat setup",
      },
      {
        image: "/work/sunset.jpg",
        alt: "Landscape sunset untuk artikel tourism film",
        date: "Catatan 10",
        title: "Film destinasi harus tahu kapan harus diam.",
        body: "Placeholder artikel tentang pacing lambat, napas lokasi, dan transisi yang tidak berisik.",
        caption: "Placeholder artikel tourism / sunset",
        cta: "Baca ritme",
      },
      {
        image: "/work/flame.jpg",
        alt: "Frame kampanye untuk artikel treatment",
        date: "Catatan 11",
        title: "Treatment yang kuat membuat shoot day lebih tenang.",
        body: "Placeholder artikel tentang menerjemahkan brief menjadi shot, tone, dan batas keputusan.",
        caption: "Placeholder artikel treatment / campaign",
        cta: "Buka treatment",
      },
      {
        image: "/work/rain.jpg",
        alt: "Frame produksi lapangan untuk artikel delivery",
        date: "Catatan 12",
        title: "Delivery master adalah bagian dari craft.",
        body: "Placeholder artikel tentang finishing, format, subtitle, dan kesiapan tayang lintas kanal.",
        caption: "Placeholder artikel delivery / broadcast",
        cta: "Baca akhir",
      },
    ],
    contactCredit: "Kontak langsung",
    contactTitle: "Bawa brief berikutnya ke Renjana.",
    contactBody:
      "Kirim detail awal lewat form, atau hubungi langsung lewat telepon, email, dan titik lokasi yang sudah aktif.",
    contactInfoLabel: "Kontak Renjana",
    contactLinks: {
      phone: "No Telp",
      email: "Email",
      maps: "Maps",
    },
    contactMapTitle: "Renjana di Google Maps",
    contactMapBody: "Buka lokasi untuk rute, estimasi perjalanan, dan titik temu produksi.",
    fields: {
      name: "Nama",
      namePlaceholder: "Nama Anda",
      email: "Email",
      emailPlaceholder: "anda@studio.com",
      project: "Proyek",
      projectPlaceholder: "Siaran, film, iklan, atau format lain yang belum punya nama.",
      submit: "Kirim brief",
      sending: "Mengirim",
      toast: "Brief tersimpan di demo. Form ini tidak mengirim data.",
    },
    footerBrand: "Renjana Pictures",
    footerCredit: "Demo built by Sarikaya Labs",
  },
  en: {
    servicesCredit: "Production house, not vendor deck",
    servicesTitle: "Three disciplines, one directed signal.",
    servicesLead:
      "Renjana moves from idea to shoot to final master without losing the emotional thread. The work can be broadcast, cinematic, or commercial; the standard stays the same.",
    services: [
      {
        label: "Broadcast",
        title: "The signal stays clear when the room gets loud.",
        body: "Live events, launches, interview rooms, multi-camera coverage, and broadcast-ready edits built around timing, redundancy, and clean delivery.",
        details: ["Multi-camera units", "Event films", "Live packages"],
      },
      {
        label: "Film",
        title: "Images with enough atmosphere to hold attention.",
        body: "Brand films, campaign narratives, product reels, and visual treatments shaped from concept through shoot day with a director's eye.",
        details: ["Treatment", "Production", "Direction"],
      },
      {
        label: "Advertising",
        title: "Commercial cuts designed for memory, not noise.",
        body: "TV spots, social-first cutdowns, motion graphics, sound, color, and delivery masters for campaigns that need to move fast.",
        details: ["TVC", "Social cutdowns", "Post production"],
      },
    ],
    reelCredit: "YouTube reel strip",
    reelTitle: "A showcase that keeps looping.",
    reelBody:
      "The reel list is now YouTube-embed driven, so final client videos can be swapped in by changing IDs, not rebuilding the section.",
    reelSkip: "Skip reel",
    reelPrev: "Previous reel",
    reelNext: "Next reel",
    reels: [
      {
        youtubeId: "aqz-KE-bpKQ",
        label: "Brand film",
        title: "Ember & Oath",
        body: "A campaign world built around heat, texture, and ritual.",
      },
      {
        youtubeId: "LXb3EKWsInQ",
        label: "Television spot",
        title: "Cloudburst",
        body: "A weather-driven product story with a controlled studio rhythm.",
      },
      {
        youtubeId: "M7lc1UVf-VE",
        label: "Company profile",
        title: "Golden Hour",
        body: "Location, light, and an edit that lets the brand breathe.",
      },
      {
        youtubeId: "ScMzIvxBSi4",
        label: "Launch film",
        title: "Signal Room",
        body: "Placeholder reel for a launch film with keynote-scale pacing.",
      },
      {
        youtubeId: "ysz5S6PUM-U",
        label: "Behind the scenes",
        title: "Studio Floor",
        body: "Placeholder production process, crew rhythm, and visual decisions.",
      },
      {
        youtubeId: "YE7VzlLtp-4",
        label: "Tourism spot",
        title: "North Coast",
        body: "Placeholder destination mood with slower, wider editorial pacing.",
      },
      {
        youtubeId: "jNQXAC9IVRw",
        label: "Archive",
        title: "First Upload",
        body: "Placeholder short archive clip for thumbnail texture variation.",
      },
      {
        youtubeId: "dQw4w9WgXcQ",
        label: "Music spot",
        title: "Neon Cut",
        body: "Placeholder music video for embed and shelf behavior checks.",
      },
      {
        youtubeId: "hTWKbfoikeg",
        label: "Concert film",
        title: "Stage Pulse",
        body: "Placeholder stage energy, light, crowd, and fast-cut coverage.",
      },
      {
        youtubeId: "9bZkp7q19f0",
        label: "Pop campaign",
        title: "Mass Appeal",
        body: "Placeholder popular-culture campaign with busy thumbnail energy.",
      },
      {
        youtubeId: "fJ9rUzIMcZQ",
        label: "Anthem film",
        title: "Long Take",
        body: "Placeholder long-form video with a recognizable editorial arc.",
      },
      {
        youtubeId: "ktvTqknDobU",
        label: "Performance",
        title: "Black Stage",
        body: "Placeholder performance piece for dark-stage and close-up contrast.",
      },
      {
        youtubeId: "3JZ_D3ELwOQ",
        label: "Motion package",
        title: "Graphic Beat",
        body: "Placeholder motion-heavy reel to test small-card composition.",
      },
    ],
    statsCredit: "Operational calm",
    statsTitle: "The craft is atmospheric. The delivery is exact.",
    stats: [
      { value: 48, suffix: "h", label: "first editorial direction" },
      { value: 12, suffix: "+", label: "delivery formats per campaign" },
      { value: 4, suffix: "K", label: "broadcast-ready mastering" },
      { value: 30, suffix: "s", label: "hero spot cutdowns" },
    ],
    testimonialCredit: "Partner notes",
    testimonialTitle: "Production notes, framed.",
    testimonials: [
      {
        image: "/work/flame.jpg",
        alt: "Warm campaign production frame",
        eyebrow: "Placeholder article",
        title: "Reading color before the camera moves.",
        body:
          "Placeholder short article on how look, wardrobe, and blocking can build a campaign's emotional world.",
        caption: "Image caption: warm campaign frame used as article placeholder.",
      },
      {
        image: "/work/rain.jpg",
        alt: "Rain-lit advertising production frame",
        eyebrow: "Placeholder article",
        title: "When weather becomes visual language.",
        body:
          "Placeholder article about production rhythm, water detail, and keeping atmosphere readable on screen.",
        caption: "Image caption: rain mood placeholder for a TVC article.",
      },
      {
        image: "/work/water.jpg",
        alt: "Water texture from a product reel",
        eyebrow: "Placeholder article",
        title: "Small details that make product films feel expensive.",
        body:
          "Placeholder article about macro movement, texture, and pacing for object-led launch films.",
        caption: "Image caption: water texture placeholder for product article.",
      },
    ],
    articleCredit: "Notes from the floor",
    articleTitle: "Articles that read like production memory.",
    articlePrev: "Previous article",
    articleNext: "Next article",
    articles: [
      {
        image: "/work/flame.jpg",
        alt: "Flame campaign production frame",
        date: "Field Note 01",
        title: "Why the first frame decides the rest of the edit.",
        body: "A short look at how Renjana blocks attention before the timeline ever opens.",
        caption: "Placeholder campaign frame / warm palette",
        cta: "Read note",
      },
      {
        image: "/work/rain.jpg",
        alt: "Rain-lit advertising production frame",
        date: "Field Note 02",
        title: "Making live coverage feel composed.",
        body: "Broadcast work is choreography: camera, comms, redundancy, and a calm final signal.",
        caption: "Placeholder TVC frame / rain",
        cta: "See process",
      },
      {
        image: "/work/water.jpg",
        alt: "Water product reel frame",
        date: "Field Note 03",
        title: "The quiet advantage of campaign cutdowns.",
        body: "A good master film already knows how it will become six sharper versions.",
        caption: "Placeholder product frame / macro",
        cta: "Study rhythm",
      },
      {
        image: "/work/smoke.jpg",
        alt: "Smoke-led fashion production frame",
        date: "Field Note 04",
        title: "Atmosphere gives a campaign its edge.",
        body: "Placeholder article on using haze, shadow, and restraint without burying the subject.",
        caption: "Placeholder fashion frame / smoke",
        cta: "Read mood",
      },
      {
        image: "/work/sunset.jpg",
        alt: "Sunset location production frame",
        date: "Field Note 05",
        title: "Golden hour is beautiful because it is strict.",
        body: "Placeholder article on location timing, blocking, and making short light windows count.",
        caption: "Placeholder location frame / golden hour",
        cta: "See note",
      },
      {
        image: "/work/flame.jpg",
        alt: "Color grading flame reference frame",
        date: "Field Note 06",
        title: "Color grading is emotional direction, not a filter.",
        body: "Placeholder article on keeping color intentional across master edits and campaign cutdowns.",
        caption: "Placeholder color article / flame",
        cta: "Read color",
      },
      {
        image: "/work/rain.jpg",
        alt: "Rain texture for sound design article",
        date: "Field Note 07",
        title: "Sound design makes images feel closer.",
        body: "Placeholder article on small sound details that make a frame feel physically present.",
        caption: "Placeholder sound article / rain",
        cta: "Hear process",
      },
      {
        image: "/work/water.jpg",
        alt: "Water texture for product film article",
        date: "Field Note 08",
        title: "Product reels need texture, not only packshots.",
        body: "Placeholder article on adding material feeling to objects that do not move by themselves.",
        caption: "Placeholder texture article / water",
        cta: "Read detail",
      },
      {
        image: "/work/smoke.jpg",
        alt: "Smoke frame for lighting article",
        date: "Field Note 09",
        title: "Good lighting gives shape somewhere to breathe.",
        body: "Placeholder article on key light, negative fill, and controlled contrast in studio work.",
        caption: "Placeholder lighting article / smoke",
        cta: "See setup",
      },
      {
        image: "/work/sunset.jpg",
        alt: "Sunset landscape for tourism film article",
        date: "Field Note 10",
        title: "A destination film must know when to stay quiet.",
        body: "Placeholder article on slower pacing, place memory, and transitions that do not interrupt.",
        caption: "Placeholder tourism article / sunset",
        cta: "Read pacing",
      },
      {
        image: "/work/flame.jpg",
        alt: "Campaign frame for treatment article",
        date: "Field Note 11",
        title: "A strong treatment makes shoot day calmer.",
        body: "Placeholder article on turning a brief into shots, tone, boundaries, and decisions.",
        caption: "Placeholder treatment article / campaign",
        cta: "Open treatment",
      },
      {
        image: "/work/rain.jpg",
        alt: "Field production frame for delivery article",
        date: "Field Note 12",
        title: "Delivery masters are part of the craft.",
        body: "Placeholder article on finishing, formats, captions, subtitles, and channel readiness.",
        caption: "Placeholder delivery article / broadcast",
        cta: "Read finish",
      },
    ],
    contactCredit: "Direct contact",
    contactTitle: "Bring the next brief to Renjana.",
    contactBody:
      "Send the early details through the form, or reach the studio directly by phone, email, and the active map point.",
    contactInfoLabel: "Renjana contact",
    contactLinks: {
      phone: "Phone",
      email: "Email",
      maps: "Maps",
    },
    contactMapTitle: "Renjana on Google Maps",
    contactMapBody: "Open the location for routes, travel estimates, and production meeting points.",
    fields: {
      name: "Name",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "you@studio.com",
      project: "Project",
      projectPlaceholder: "Broadcast, film, advertising, or something stranger.",
      submit: "Send the brief",
      sending: "Sending",
      toast: "Message staged. This demo form does not send anywhere.",
    },
    footerBrand: "Renjana Pictures",
    footerCredit: "Demo built by Sarikaya Labs",
  },
};

function youtubeSrc(id: string) {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    loop: "1",
    playlist: id,
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

function getStoryCopy(language: SiteLanguage, content?: StoryContent) {
  const fallback = STORY_COPY[language];

  return {
    ...fallback,
    ...content,
    contactLinks: {
      ...fallback.contactLinks,
      ...content?.contactLinks,
    },
    fields: {
      ...fallback.fields,
      ...content?.fields,
    },
    services: content?.services?.length ? content.services : fallback.services,
    reels: content?.reels?.length ? content.reels : fallback.reels,
    stats: content?.stats?.length ? content.stats : fallback.stats,
    testimonials: content?.testimonials?.length
      ? content.testimonials
      : fallback.testimonials,
    articles: content?.articles?.length ? content.articles : fallback.articles,
  } satisfies StoryCopy;
}

function getLoopStartPosition(total: number) {
  return total > 1 ? total : 0;
}

function getLoopIndex(position: number, total: number) {
  if (total < 1) return 0;
  return ((position % total) + total) % total;
}

function getNormalizedLoopPosition(position: number, total: number) {
  if (total < 2) return position;
  if (position < total) return position + total;
  if (position >= total * 2) return position - total;
  return position;
}

function getArticleLoopStartPosition(total: number) {
  return total > 1 ? total * ARTICLE_LOOP_START_COPY : 0;
}

function getArticleNormalizedLoopPosition(position: number, total: number) {
  if (total < 2) return position;

  const lowBoundary = total;
  const highBoundary = total * (ARTICLE_LOOP_COPY_COUNT - 1);
  const offset = total * ARTICLE_LOOP_START_COPY;

  if (position < lowBoundary) return position + offset;
  if (position >= highBoundary) return position - offset;
  return position;
}

function getLoopItems<T>(
  items: T[],
  copyCount = 3,
  primaryCopyIndex = Math.floor(copyCount / 2),
) {
  if (items.length < 2) {
    return items.map((item, index) => ({
      item,
      index,
      isClone: false,
      key: `item-${index}`,
      position: index,
    }));
  }

  return Array.from({ length: copyCount }, (_, copyIndex) => copyIndex).flatMap((copyIndex) =>
    items.map((item, index) => ({
      item,
      index,
      isClone: copyIndex !== primaryCopyIndex,
      key: `copy-${copyIndex}-item-${index}`,
      position: copyIndex * items.length + index,
    })),
  );
}

export default function StorySections({
  content,
  language,
}: {
  content?: StoryContent;
  language: SiteLanguage;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const reelShellRef = useRef<HTMLDivElement>(null);
  const articleShellRef = useRef<HTMLDivElement>(null);
  const reelJumpRef = useRef(true);
  const articleJumpRef = useRef(true);
  const [formState, setFormState] = useState<"idle" | "sending" | "sent">("idle");
  const copy = {
    ...getStoryCopy(language, content),
    articles: ARTICLES_BY_LANGUAGE[language],
  };
  const contactDetails = {
    ...CONTACT_DETAILS,
    ...content?.contactDetails,
  };
  const reelCount = copy.reels.length;
  const articleCount = copy.articles.length;
  const [reelPosition, setReelPosition] = useState(() =>
    getLoopStartPosition(reelCount),
  );
  const [articlePosition, setArticlePosition] = useState(() =>
    getArticleLoopStartPosition(articleCount),
  );
  const reelIndex = getLoopIndex(reelPosition, reelCount);
  const articleIndex = getLoopIndex(articlePosition, articleCount);
  const reelLoopItems = getLoopItems(copy.reels);
  const articleLoopItems = getLoopItems(
    copy.articles,
    ARTICLE_LOOP_COPY_COUNT,
    ARTICLE_LOOP_START_COPY,
  );

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || reelCount < 2) return;

    const timer = window.setInterval(() => {
      setReelPosition((current) => current + 1);
    }, 9000);
    return () => window.clearInterval(timer);
  }, [reelCount]);

  useIsomorphicLayoutEffect(() => {
    const shell = reelShellRef.current;
    if (!shell) return;

    const cards = shell.querySelectorAll<HTMLElement>("[data-reel-card]");
    const target = cards[reelPosition];
    if (!target) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shouldJump = reelJumpRef.current;
    reelJumpRef.current = false;
    shell.scrollTo({
      left: target.offsetLeft - (shell.clientWidth - target.clientWidth) / 2,
      behavior: reduce || shouldJump ? "auto" : "smooth",
    });

    const normalizedPosition = getNormalizedLoopPosition(reelPosition, reelCount);
    if (normalizedPosition === reelPosition) return;

    const resetTimer = window.setTimeout(
      () => {
        reelJumpRef.current = true;
        setReelPosition(normalizedPosition);
      },
      reduce ? 0 : 620,
    );

    return () => window.clearTimeout(resetTimer);
  }, [reelCount, reelPosition]);

  useIsomorphicLayoutEffect(() => {
    const shell = articleShellRef.current;
    if (!shell) return;

    const cards = shell.querySelectorAll<HTMLElement>("[data-article-card]");
    const target = cards[articlePosition];
    if (!target) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shouldJump = articleJumpRef.current;
    articleJumpRef.current = false;
    shell.scrollTo({
      left: target.offsetLeft - (shell.clientWidth - target.clientWidth) / 2,
      behavior: reduce || shouldJump ? "auto" : "smooth",
    });

    const normalizedPosition = getArticleNormalizedLoopPosition(
      articlePosition,
      articleCount,
    );
    if (normalizedPosition === articlePosition) return;

    const resetTimer = window.setTimeout(
      () => {
        articleJumpRef.current = true;
        setArticlePosition(normalizedPosition);
      },
      reduce ? 0 : 320,
    );

    return () => window.clearTimeout(resetTimer);
  }, [articleCount, articlePosition]);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-service-card]", {
          y: 54,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: "[data-service-grid]",
            start: "top 78%",
            once: true,
          },
        });

        gsap.from("[data-soft-reveal]", {
          y: 36,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: "[data-soft-reveal-root]",
            start: "top 78%",
            once: true,
          },
        });

        gsap.utils.toArray<HTMLElement>("[data-stat-value]").forEach((el) => {
          const target = Number(el.dataset.target ?? 0);
          const suffix = el.dataset.suffix ?? "";
          const obj = { value: 0 };

          gsap.to(obj, {
            value: target,
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 72%",
              once: true,
            },
            onUpdate: () => {
              el.textContent = `${Math.round(obj.value)}${suffix}`;
            },
          });
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.utils.toArray<HTMLElement>("[data-stat-value]").forEach((el) => {
          el.textContent = `${el.dataset.target ?? "0"}${el.dataset.suffix ?? ""}`;
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const moveReel = (direction: 1 | -1) => {
    if (reelCount < 2) return;
    setReelPosition((current) => current + direction);
  };

  const moveArticle = (direction: 1 | -1) => {
    if (articleCount < 2) return;
    setArticlePosition((current) => current + direction);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formState === "sending") return;
    setFormState("sending");
    window.setTimeout(() => setFormState("sent"), 900);
    window.setTimeout(() => setFormState("idle"), 3800);
    event.currentTarget.reset();
  };

  const statsSection = (
    <section ref={statsRef} id="stats" className={styles.stats} aria-labelledby="stats-title">
      <div className={styles.inner}>
        <div className={styles.statsHeader}>
          <span className={styles.credit}>{copy.statsCredit}</span>
          <h2 id="stats-title" className={styles.sectionTitle}>
            {copy.statsTitle}
          </h2>
        </div>

        <div className={styles.statGrid}>
          {copy.stats.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <span
                data-stat-value
                data-target={stat.value}
                data-suffix={stat.suffix}
                className={styles.statValue}
              >
                0{stat.suffix}
              </span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div ref={rootRef}>
      <section id="services" className={styles.services} aria-labelledby="services-title">
        <div className={styles.inner}>
          <div className={styles.serviceIntro}>
            <span className={styles.credit}>{copy.servicesCredit}</span>
            <h2 id="services-title" className={styles.sectionTitle}>
              {copy.servicesTitle}
            </h2>
            <p className={styles.lead}>{copy.servicesLead}</p>
          </div>

          <div className={styles.serviceGrid} data-service-grid>
            {copy.services.map((service, index) => (
              <article
                key={service.label}
                className={styles.serviceCard}
                data-service-card
              >
                <span className={styles.serviceIndex}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <span className={styles.serviceLabel}>{service.label}</span>
                  <h3>{service.title}</h3>
                  <p>{service.body}</p>
                </div>
                <ul>
                  {service.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="work" className={styles.horizontal} aria-labelledby="work-title">
        <div className={styles.horizontalHeader}>
          <div>
            <span className={styles.credit}>{copy.reelCredit}</span>
            <h2 id="work-title" className={styles.horizontalTitle}>
              {copy.reelTitle}
            </h2>
            <p>{copy.reelBody}</p>
          </div>
        </div>

        <div ref={reelShellRef} className={styles.reelShell}>
          <div className={styles.reelTrack}>
            {reelLoopItems.map(({ item: panel, isClone, key, position }) => (
              <article
                key={key}
                aria-hidden={isClone}
                data-reel-card
                data-active={position === reelPosition}
                data-loop-position={position}
                className={styles.reelPanel}
              >
                <div className={styles.youtubeFrame}>
                  <iframe
                    src={youtubeSrc(panel.youtubeId)}
                    title={`${panel.title} - ${panel.label}`}
                    loading="lazy"
                    tabIndex={isClone ? -1 : undefined}
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
                <div className={styles.reelCopy}>
                  <span>{panel.label}</span>
                  <h3>{panel.title}</h3>
                  <p>{panel.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.carouselBar}>
          <button
            type="button"
            onClick={() => moveReel(-1)}
            aria-label={copy.reelPrev}
            disabled={reelCount < 2}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <span>
            {String(reelIndex + 1).padStart(2, "0")} /{" "}
            {String(copy.reels.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={() => moveReel(1)}
            aria-label={copy.reelNext}
            disabled={reelCount < 2}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      <section
        id="quote"
        className={styles.quote}
        aria-labelledby="quote-title"
        data-soft-reveal-root
      >
        <div className={styles.inner}>
          <div className={styles.testimonialHeader} data-soft-reveal>
            <span className={styles.credit}>{copy.testimonialCredit}</span>
            <h2 id="quote-title" className={styles.sectionTitle}>
              {copy.testimonialTitle}
            </h2>
          </div>

          <div className={styles.testimonialGrid}>
            {copy.testimonials.map((testimonial) => (
              <figure
                key={testimonial.title}
                className={styles.testimonial}
                data-soft-reveal
              >
                <div className={styles.testimonialImage}>
                  <Image
                    src={testimonial.image}
                    alt={testimonial.alt}
                    width={720}
                    height={480}
                    sizes="(max-width: 1060px) 100vw, 33vw"
                  />
                </div>
                <figcaption className={styles.testimonialCaption}>
                  {testimonial.caption}
                </figcaption>
                <article className={styles.testimonialArticle}>
                  <span>{testimonial.eyebrow}</span>
                  <h3>{testimonial.title}</h3>
                  <p>{testimonial.body}</p>
                </article>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.news} aria-labelledby="news-title">
        <div className={styles.inner}>
          <div className={styles.newsHeader}>
            <div>
              <span className={styles.credit}>{copy.articleCredit}</span>
              <h2 id="news-title" className={styles.sectionTitle}>
                {copy.articleTitle}
              </h2>
            </div>
            <div className={styles.articleControls}>
              <button
                type="button"
                onClick={() => moveArticle(-1)}
                aria-label={copy.articlePrev}
                disabled={articleCount < 2}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </button>
              <span>
                {String(articleIndex + 1).padStart(2, "0")} /{" "}
                {String(copy.articles.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={() => moveArticle(1)}
                aria-label={copy.articleNext}
                disabled={articleCount < 2}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div ref={articleShellRef} className={styles.articleCarousel}>
            <div className={styles.articleTrack}>
              {articleLoopItems.map(({ item: article, isClone, key, position }) => {
                const isHiddenClone = isClone && position !== articlePosition;

                return (
                  <article
                    key={key}
                    aria-hidden={isHiddenClone}
                    data-article-card
                    data-active={position === articlePosition}
                    data-loop-position={position}
                    className={styles.article}
                  >
                    <div className={styles.articleImage}>
                      <Image
                        src={article.image}
                        alt={article.alt}
                        width={720}
                        height={480}
                        sizes="(max-width: 720px) 82vw, (max-width: 1180px) 38vw, 24vw"
                        loading={
                          position >= articleCount &&
                          position < articleCount * (ARTICLE_LOOP_COPY_COUNT - 1)
                            ? "eager"
                            : "lazy"
                        }
                        decoding="async"
                      />
                    </div>
                    <p className={styles.articleCaption}>{article.caption}</p>
                    <div className={styles.articleBody}>
                      <span>{article.date}</span>
                      <h3>{article.title}</h3>
                      <p>{article.body}</p>
                      <Link
                        href={`/articles/${
                          article.slug ?? getSlugForArticleTitle(article.title)
                        }`}
                        prefetch={isHiddenClone ? false : undefined}
                        tabIndex={isHiddenClone ? -1 : undefined}
                      >
                        {article.cta}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {statsSection}

      <section id="contact" className={styles.contact} aria-labelledby="contact-title">
        <div className={styles.contactInner}>
          <div className={styles.contactCopy}>
            <span className={styles.credit}>{copy.contactCredit}</span>
            <h2 id="contact-title">{copy.contactTitle}</h2>
            <p>{copy.contactBody}</p>
            <div className={styles.contactLinks} aria-label={copy.contactInfoLabel}>
              <a href={contactDetails.phoneHref}>
                <span>{copy.contactLinks.phone}</span>
                <strong>{contactDetails.phoneDisplay}</strong>
              </a>
              <a href={contactDetails.emailHref}>
                <span>{copy.contactLinks.email}</span>
                <strong>{contactDetails.email}</strong>
              </a>
              <a
                href={contactDetails.mapsUrl}
                target="_blank"
                rel="noreferrer"
              >
                <span>{copy.contactLinks.maps}</span>
                <strong>{copy.contactMapTitle}</strong>
              </a>
            </div>
          </div>

          <form className={styles.form} onSubmit={onSubmit}>
            <label>
              <span>{copy.fields.name}</span>
              <input name="name" type="text" placeholder={copy.fields.namePlaceholder} required />
            </label>
            <label>
              <span>{copy.fields.email}</span>
              <input
                name="email"
                type="email"
                placeholder={copy.fields.emailPlaceholder}
                required
              />
            </label>
            <label>
              <span>{copy.fields.project}</span>
              <textarea
                name="message"
                rows={4}
                placeholder={copy.fields.projectPlaceholder}
                required
              />
            </label>
            <button type="submit" disabled={formState === "sending"}>
              {formState === "sending" ? copy.fields.sending : copy.fields.submit}
            </button>
            <p className={styles.toast} data-visible={formState === "sent"}>
              {copy.fields.toast}
            </p>
          </form>
        </div>

        <footer className={styles.footer}>
          <span>{copy.footerBrand}</span>
          <span>{copy.footerCredit}</span>
        </footer>
      </section>
    </div>
  );
}
