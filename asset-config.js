/* V6 media and links. Configure resume.url and cleaned public slides here. */
const portfolioAssets = {
  "profilePhoto": {
    "enabled": true,
    "path": "assets/profile/gidion-depari.webp",
    "alt": "Portrait of Gidion Depari",
    "width": 800,
    "height": 1000
  },
  "logos": {
    "university": {
      "enabled": true,
      "path": "assets/logos/university.webp",
      "initials": "UMI"
    },
    "dibimbing": {
      "enabled": true,
      "path": "assets/logos/dibimbing.webp",
      "initials": "DB"
    },
    "revou": {
      "enabled": true,
      "path": "assets/logos/revou.webp",
      "initials": "RV"
    },
    "pejuangApoteker": {
      "enabled": true,
      "path": "assets/logos/pejuang-apoteker.webp",
      "initials": "PA",
      "wide": true
    },
    "bnsp": {
      "enabled": true,
      "path": "assets/logos/bnsp.webp",
      "initials": "BNSP",
      "wide": true
    },
    "microsoft": {
      "enabled": true,
      "path": "assets/logos/microsoft.svg",
      "initials": "MS",
      "wide": true
    },
    "rakamin": {
      "enabled": true,
      "path": "assets/logos/rakamin.webp",
      "initials": "RA"
    },
    "erajaya": {
      "enabled": true,
      "path": "assets/logos/erajaya.webp",
      "initials": "ER",
      "wide": true
    },
    "lifevitae": {
      "enabled": true,
      "path": "assets/logos/lifevitae.webp",
      "initials": "LV",
      "dark": true
    },
    "bhavana": {
      "enabled": true,
      "path": "assets/logos/bhavana-tea.webp",
      "initials": "BT",
      "wide": true
    },
    "oracle": {
      "enabled": true,
      "path": "assets/logos/oracle.webp",
      "initials": "OR",
      "wide": true
    },
    "sevenpreneur": {
      "enabled": true,
      "path": "assets/logos/sevenpreneur.webp",
      "initials": "SP"
    },
    "language": {
      "enabled": true,
      "path": "assets/logos/language-access.webp",
      "initials": "LA"
    },
    "edspert": {
      "enabled": true,
      "path": "assets/logos/edspert.webp",
      "initials": "ED",
      "wide": true
    }
  },
  "projects": {
    "jobfit": {
      "path": "assets/jobfit-results.png",
      "width": 1800,
      "height": 1262,
      "alt": "JobFit application: local product workflow capture",
      "note": "Owner-provided interface capture; illustrates the application, not the held-out benchmark."
    },
    "stock-rag": {
      "path": "assets/stock-chat.png",
      "width": 3024,
      "height": 1706,
      "alt": "Stock Research RAG Assistant: document-grounded chat and citations",
      "note": "Earlier four-document interface. The benchmark uses five PDFs. Historical answer example, not current market data or investment advice."
    },
    "house-mlops": {
      "path": "assets/house-app.png",
      "width": 3024,
      "height": 1964,
      "alt": "House Price MLOps: model information and housing-price prediction interface",
      "note": "Owner-provided interface capture. The public checkout lacks model modules and weights needed to reproduce this interface."
    },
    "smartshopper": {
      "path": "assets/smartshopper.png",
      "width": 3024,
      "height": 1726,
      "alt": "SmartShopper assistant using synthetic fashion-store data"
    },
    "smartsplit": {
      "enabled": true,
      "path": "assets/projects/smartsplit/preview.webp",
      "original": "assets/projects/smartsplit/result-redacted.png",
      "width": 1296,
      "height": 1214,
      "alt": "SmartSplit Bill AI: genuine bill-splitting result interface with personal and transaction details redacted",
      "note": "Result view. Names and transaction details redacted for privacy."
    },
    "ner": {
      "enabled": false,
      "path": null
    },
    "churn": {
      "enabled": false,
      "path": null
    },
    "recommender": {
      "enabled": false,
      "path": null
    },
    "forecasting": {
      "enabled": false,
      "path": null
    },
    "butterfly": {
      "enabled": false,
      "path": null
    }
  },
  "certificates": {
    "microsoft": {
      "approved": true,
      "path": "assets/credentials/microsoft-applied-skills.webp",
      "original": "assets/credentials/microsoft-applied-skills.png",
      "alt": "Gidion Depari — Microsoft Applied Skills credential for Azure AI Document Intelligence, earned April 2025"
    }
  },
  "resume": {
    "url": "https://drive.google.com/file/d/1K_8BV-J8CWZcLMSpLiA63CobD2p_tW0e/view?usp=sharing",
    "label": "Resume"
  },
  "slides": {
    "jobfit": "",
    "stock-rag": "",
    "house-mlops": "",
    "smartshopper": "",
    "smartsplit": ""
  }
};
const organizationKeys={
 'Universitas Methodist Indonesia':'university','Dibimbing':'dibimbing','RevoU Tech Academy':'revou','RevoU Tech Academy × Kampus Merdeka':'revou','Pejuang Apoteker':'pejuangApoteker','Badan Nasional Sertifikasi Profesi (BNSP)':'bnsp','BNSP':'bnsp','Microsoft':'microsoft','Rakamin Academy':'rakamin','Erajaya × Rakamin Academy':'erajaya','LifeVitae × Rakamin Academy':'lifevitae','Bhavana Tea':'bhavana','Oracle Academy':'oracle','Sevenpreneur':'sevenpreneur','The Language Access':'language','Edspert.id':'edspert'
};
function organizationLogo(name){
 const key=organizationKeys[name]||name,asset=portfolioAssets.logos[key];
 if(!asset)return '';
 return `<span class="org-mark ${asset.wide?'org-mark-wide':''} ${asset.dark?'org-mark-dark':''}" aria-hidden="true" data-media-slot="logo"><span class="org-initials">${asset.initials}</span>${asset.enabled&&asset.path?`<img src="${asset.path}" alt="" loading="lazy" decoding="async" data-fallback-media="logo">`:''}</span>`;
}
function portraitMarkup(){const a=portfolioAssets.profilePhoto;return `<aside class="identity-panel profile-card"><div class="portrait-frame" data-media-slot="portrait"><div class="identity-monogram" aria-hidden="true">gd<span>.</span></div>${a.enabled&&a.path?`<img src="${a.path}" alt="${a.alt}" width="${a.width}" height="${a.height}" loading="lazy" decoding="async" data-fallback-media="portrait">`:''}</div><div class="profile-caption"><strong>Gidion Depari</strong><span>Information Systems Graduate</span><span>Applied AI Engineer</span></div></aside>`}
function projectMedia(project,priority=false){
 const a=portfolioAssets.projects[project.id];
 if(!a?.path||a.enabled===false)return '';
 return `<div class="project-media"><button class="project-image-button screenshot-frame screenshot-${project.id}" type="button" data-image="${a.original||a.path}" data-caption="${a.alt}${a.note?' — '+a.note:''}" aria-label="Enlarge ${project.name} screenshot"><span class="screenshot-viewport"><img class="od-media" src="${a.path}" width="${a.width}" height="${a.height}" alt="${a.alt}" ${priority?'fetchpriority="high"':'loading="lazy"'} decoding="async"></span><span class="screenshot-enlarge" aria-hidden="true">View full screenshot ↗</span></button><div class="screenshot-context">${a.note||a.alt}</div></div>`;
}
