/*
  MODIFIER ICI : tous les liens et contacts du site sont rassemblés ici.
  Pour afficher un nouveau bouton, renseigne son adresse dans href puis visible: true.
  sameAs: true ajoute aussi le lien aux données structurées du profil (pour les profils sociaux).
  Laisse visible: false tant que tu n'as pas une vraie adresse de profil.
  Le numéro WhatsApp est volontairement présent uniquement dans le lien, jamais dans le texte affiché.
*/
window.profileLinks = [
  {
    label: "E-mail",
    href: "mailto:erdisdanielsuamajr@gmail.com",
    visible: true,
    group: "primary",
    icon: "assets/icons/email.svg",
    external: false,
    sameAs: false
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/243856238509",
    visible: true,
    group: "primary",
    icon: "assets/icons/whatsapp.svg",
    external: true,
    sameAs: false
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/erdis-daniel-suama-jr-6a0026439/",
    visible: true,
    group: "primary",
    icon: "assets/icons/linkedin.svg",
    external: true,
    sameAs: true
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/erdis.daniel.suama.jr/",
    visible: true,
    group: "primary",
    icon: "assets/icons/instagram.svg",
    external: true,
    sameAs: true
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1HBtpDrGRD/",
    visible: true,
    group: "secondary",
    icon: "assets/icons/facebook.svg",
    external: true,
    sameAs: true
  },
  {
    label: "Messenger",
    href: "https://m.me/Erdis.Daniel.Suama.Jr",
    visible: true,
    group: "secondary",
    icon: "assets/icons/messenger.svg",
    external: true,
    sameAs: false
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@erdis_daniel_suama.jr",
    visible: true,
    group: "secondary",
    icon: "assets/icons/tiktok.svg",
    external: true,
    sameAs: true
  },
  {
    label: "Threads",
    href: "https://www.threads.com/@erdis.daniel.suama.jr",
    visible: true,
    group: "secondary",
    icon: "assets/icons/threads.svg",
    external: true,
    sameAs: true
  },
  {
    label: "X",
    href: "https://x.com/Erdissuama",
    visible: true,
    group: "secondary",
    icon: "assets/icons/x.svg",
    external: true,
    sameAs: true
  },
  {
    label: "Pinterest",
    href: "https://pin.it/7D0P9tI2W",
    visible: true,
    group: "secondary",
    icon: "assets/icons/pinterest.svg",
    external: true,
    sameAs: true
  },
  {
    label: "Telegram",
    href: "",
    visible: false,
    group: "secondary",
    icon: "",
    external: true,
    sameAs: false
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@erdissuamadanieljr",
    visible: true,
    group: "secondary",
    icon: "assets/icons/youtube.svg",
    external: true,
    sameAs: true
  },
  {
    label: "GitHub",
    href: "https://github.com/Erdis-Daniel-Suama-Jr",
    visible: true,
    group: "secondary",
    icon: "assets/icons/github.svg",
    external: true,
    sameAs: true
  },
  {
    label: "Spotify",
    href: "https://open.spotify.com/user/31xwdk2exzcevntyvd6ctpfpukpu",
    visible: true,
    group: "secondary",
    icon: "assets/icons/spotify.svg",
    external: true,
    sameAs: true
  }
];
