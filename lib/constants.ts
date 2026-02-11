export const NAV_LINKS = [
  { href: "#fonctionnalites", label: "Fonctionnalités" },
  { href: "#comment-ca-marche", label: "Comment ça marche" },
  { href: "#tarifs", label: "Tarifs" },
  { href: "#faq", label: "FAQ" },
] as const;

export const HERO_STATS = [
  { value: "10x", label: "plus rapide" },
  { value: "100%", label: "conforme Qualiopi" },
  { value: "+500", label: "syllabus créés" },
] as const;

export const FEATURE_DETAILS = [
  {
    icon: "sparkles",
    tag: "Intelligence Artificielle",
    title: "Générez un syllabus complet en quelques secondes",
    description:
      "Décrivez votre formation — titre, durée, public — et l'IA produit un syllabus structuré avec objectifs pédagogiques, séquençage horaire, modalités d'évaluation et bibliographie.",
    highlights: [
      "Objectifs alignés avec la taxonomie de Bloom",
      "Séquençage horaire détaillé et cohérent",
      "Bibliographie et ressources suggérées",
      "Adapté au niveau et au public cible",
    ],
  },
  {
    icon: "shield",
    tag: "Conformité",
    title: "Qualiopi & RNCP intégrés nativement",
    description:
      "Chaque syllabus généré respecte automatiquement tous les critères requis pour vos audits. Plus besoin de vérifier manuellement — Humia s'en charge.",
    highlights: [
      "7 critères Qualiopi vérifiés automatiquement",
      "Mapping des blocs de compétences RNCP",
      "Indicateurs d'accessibilité PSH inclus",
      "Prérequis et objectifs mesurables intégrés",
    ],
  },
  {
    icon: "document",
    tag: "Export",
    title: "PDF pro ou Word éditable, en un clic",
    description:
      "Exportez vos syllabus dans le format de votre choix. PDF haute qualité pour les audits, Word pour les modifications en équipe.",
    highlights: [
      "PDF professionnel prêt pour les audits",
      "Word (.docx) entièrement éditable",
      "Mise en page automatique et cohérente",
      "Logo et charte graphique personnalisables",
    ],
  },
  {
    icon: "template",
    tag: "Collaboration",
    title: "Des templates partagés pour toute l'équipe",
    description:
      "Créez des modèles réutilisables et partagez-les avec vos formateurs. Garantissez l'homogénéité de tous vos programmes de formation.",
    highlights: [
      "Bibliothèque de templates partagée",
      "Uniformité entre tous les formateurs",
      "Versioning et historique des modifications",
      "Droits d'accès par rôle",
    ],
  },
] as const;

export const FEATURES_GRID = [
  { icon: "sparkles", title: "Génération IA", description: "Syllabus complet en quelques secondes." },
  { icon: "shield", title: "Conformité Qualiopi", description: "Critères et indicateurs intégrés." },
  { icon: "document", title: "Export PDF & Word", description: "Formats prêts pour vos audits." },
  { icon: "template", title: "Templates d'équipe", description: "Modèles partagés et uniformes." },
  { icon: "chart", title: "Mapping RNCP", description: "Blocs de compétences alignés." },
  { icon: "sync", title: "Mise à jour 1 clic", description: "Votre syllabus suit vos évolutions." },
] as const;

export type FeatureIcon = (typeof FEATURES_GRID)[number]["icon"];

export const STEPS = [
  { step: "1", title: "Décrivez", description: "Titre, durée, public cible, objectifs. Humia comprend votre contexte pédagogique." },
  { step: "2", title: "Générez", description: "L'IA produit un syllabus complet : objectifs, séquençage, évaluation, bibliographie." },
  { step: "3", title: "Exportez", description: "Personnalisez si besoin et exportez en PDF ou Word, prêt pour vos audits." },
] as const;

export const PRICING = [
  {
    name: "Free",
    subtitle: "Pour découvrir",
    monthlyPrice: "0 €",
    annualPrice: "0 €",
    annualTotal: null,
    credits: "5 crédits / mois",
    badge: null,
    features: [
      "5 crédits par mois",
      "Génération de syllabus",
      "Export PDF",
      "Conformité Qualiopi",
    ],
    cta: "Commencer gratuitement",
    highlighted: false,
  },
  {
    name: "Pro",
    subtitle: "Pour les responsables pédagogiques",
    monthlyPrice: "19,99 €",
    annualPrice: "9,99 €",
    annualTotal: "119,88 €/an",
    credits: "20 crédits / mois",
    badge: "Populaire",
    features: [
      "20 crédits par mois",
      "Génération de syllabus",
      "Génération de programmes de formation",
      "Export PDF & Word",
      "Conformité Qualiopi & RNCP",
      "Templates personnalisables",
      "Support par email",
    ],
    cta: "Choisir Pro",
    highlighted: true,
  },
  {
    name: "Business",
    subtitle: "Pour les équipes & organismes",
    monthlyPrice: "49,99 €",
    annualPrice: "24,99 €",
    annualTotal: "299,88 €/an",
    credits: "200 crédits / mois",
    badge: null,
    features: [
      "200 crédits par mois",
      "Tout le plan Pro inclus",
      "Groupes de syllabus",
      "Couleurs & branding personnalisés",
      "Export marque blanche",
      "Support prioritaire",
      "Accès anticipé nouvelles fonctionnalités",
    ],
    cta: "Choisir Business",
    highlighted: false,
  },
] as const;

export const FAQ_ITEMS = [
  { question: "L'IA peut-elle vraiment produire des syllabus de qualité ?", answer: "Oui. Humia s'appuie sur des milliers de syllabus validés et suit les référentiels pédagogiques français (Qualiopi, RNCP, approche par compétences)." },
  { question: "Puis-je personnaliser les syllabus générés ?", answer: "Absolument. Chaque syllabus est entièrement modifiable. Vous pouvez ajuster les objectifs, le séquençage, les modalités d'évaluation et sauvegarder vos propres templates." },
  { question: "Est-ce conforme aux exigences Qualiopi ?", answer: "Humia intègre nativement les critères et indicateurs Qualiopi : objectifs mesurables, prérequis, modalités d'évaluation, accessibilité, etc." },
  { question: "Quels formats d'export sont disponibles ?", answer: "PDF professionnel haute qualité et Word (.docx) entièrement éditable." },
  { question: "Puis-je résilier à tout moment ?", answer: "L'offre mensuelle est sans engagement. L'offre annuelle implique un engagement de 12 mois pour bénéficier du tarif réduit." },
  { question: "Combien de syllabus puis-je générer ?", answer: "La génération est illimitée sur les deux formules." },
] as const;

export const TRAINING_CARDS = [
  { title: "Management de Projet Agile", duration: "21h (3 jours)", level: "Intermédiaire", tags: ["Scrum", "Kanban", "Sprint"] },
  { title: "Cybersécurité en Entreprise", duration: "14h (2 jours)", level: "Avancé", tags: ["RGPD", "Audit", "SSI"] },
  { title: "Marketing Digital", duration: "35h (5 jours)", level: "Débutant", tags: ["SEO", "Ads", "Analytics"] },
  { title: "Gestion des Ressources Humaines", duration: "28h (4 jours)", level: "Intermédiaire", tags: ["Recrutement", "GPEC", "Entretien"] },
  { title: "Leadership & Management", duration: "14h (2 jours)", level: "Avancé", tags: ["Coaching", "Feedback", "Délégation"] },
  { title: "Comptabilité & Finance", duration: "35h (5 jours)", level: "Débutant", tags: ["Bilan", "TVA", "Trésorerie"] },
  { title: "Intelligence Artificielle Appliquée", duration: "21h (3 jours)", level: "Intermédiaire", tags: ["Machine Learning", "NLP", "Data"] },
  { title: "Communication Professionnelle", duration: "14h (2 jours)", level: "Débutant", tags: ["Oral", "Écrit", "Présentation"] },
  { title: "Droit du Travail", duration: "21h (3 jours)", level: "Intermédiaire", tags: ["Contrats", "Licenciement", "CSE"] },
  { title: "Excel & Data Analysis", duration: "14h (2 jours)", level: "Intermédiaire", tags: ["Tableaux croisés", "VBA", "Power Query"] },
  { title: "Développement Web Full-Stack", duration: "70h (10 jours)", level: "Avancé", tags: ["React", "Node.js", "API REST"] },
  { title: "Conduite du Changement", duration: "14h (2 jours)", level: "Intermédiaire", tags: ["Résistance", "Accompagnement", "Vision"] },
] as const;

export const FOOTER_LINKS = [
  { href: "#", label: "Mentions légales" },
  { href: "#", label: "CGV" },
  { href: "#", label: "Confidentialité" },
  { href: "#contact", label: "Contact" },
] as const;
