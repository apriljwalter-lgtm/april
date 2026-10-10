// All of the site's personal content lives here — edit this file to update the page.

export const profile = {
  name: 'April',
  tagline: 'Keeper of tomes · Spinner of yarns · Tender of systems',

  work: {
    field: 'Healthcare IT',
    blurb:
      'By daylight I work in Healthcare IT — keeping the systems that clinicians and patients rely on running smoothly, securely, and quietly in the background, the way the best magic always does.',
  },

  goals: [
    {
      title: 'Complete the AIBHS Program',
      blurb:
        'A vow inked in purple and sealed in wax: to see the AIBHS program through to its final page.',
      status: 'In progress — the ink is still wet',
    },
  ],

  hobbies: [
    {
      name: 'Reading',
      icon: 'book',
      blurb:
        'Candlelight, a heavy blanket, and a novel with a moody moor or a sprawling family saga. The older the pages smell, the better.',
    },
    {
      name: 'Fiber Arts',
      icon: 'yarn',
      blurb:
        'Crochet and cross stitch — hooking skeins into something warm and wearable, and stitching tiny X’s into linen one by one. Every stitch a small spell, every project a little bit of patience made visible.',
    },
    {
      name: 'Fashion History',
      icon: 'dressForm',
      link: '#history',
      blurb:
        'Farthingales, bustles, and empire waists. I love what clothes reveal about the people who wore them, and the centuries of handwork stitched into every seam.',
    },
  ],

  books: [
    {
      title: 'Their Eyes Were Watching God',
      author: 'Zora Neale Hurston',
      year: 1937,
      color: '#4a2a5e',
      height: 92,
    },
    {
      title: 'Wuthering Heights',
      author: 'Emily Brontë',
      year: 1847,
      color: '#2b2238',
      height: 100,
    },
    {
      title: 'East of Eden',
      author: 'John Steinbeck',
      year: 1952,
      color: '#5b1f2e',
      height: 96,
    },
    {
      title: 'The Once and Future Witches',
      author: 'Alix E. Harrow',
      year: 2020,
      color: '#1f3a33',
      height: 98,
    },
    // Jane Austen's complete novels
    {
      title: 'Sense and Sensibility',
      author: 'Jane Austen',
      year: 1811,
      color: '#3b4a6b',
      height: 88,
    },
    {
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      year: 1813,
      color: '#6b2f4a',
      height: 94,
    },
    {
      title: 'Mansfield Park',
      author: 'Jane Austen',
      year: 1814,
      color: '#2f4a3a',
      height: 90,
    },
    {
      title: 'Emma',
      author: 'Jane Austen',
      year: 1815,
      color: '#5e4a7a',
      height: 84,
    },
    {
      title: 'Northanger Abbey',
      author: 'Jane Austen',
      year: 1817,
      color: '#3a2a20',
      height: 92,
    },
    {
      title: 'Persuasion',
      author: 'Jane Austen',
      year: 1817,
      color: '#2a3550',
      height: 86,
    },
    {
      title: 'Lady Susan',
      author: 'Jane Austen',
      year: 1871,
      color: '#4a1f3a',
      height: 78,
    },
  ],

  bands: [
    { name: 'Twenty One Pilots', label: '#c94f4f' },
    { name: 'My Chemical Romance', label: '#9b6fd1' },
    { name: 'Weezer', label: '#3f78c4' },
    { name: 'Lady Gaga', label: '#d94f8e' },
  ],

  favoriteColor: { name: 'Purple', hex: '#7b4bb8' },

  // Chapter VI: why fashion history matters to me, shown above the timeline.
  fashionHistory: {
    intro: [
      'Fashion history is one of my favorite rabbit holes. A hemline or a sleeve can tell you what a whole society feared, hoped for, and could afford.',
      'As someone who crochets and cross-stitches, I can’t look at a Victorian gown without counting the hours of handwork in it. And it’s no accident my shelf is full of Austen: I love picturing her heroines in their muslin.',
    ],
  },

  // `shape` picks the dress silhouette drawn in History.jsx; `shelf` links eras to books above.
  fashionEras: [
    {
      shape: 'medieval',
      name: 'High Medieval',
      years: 'c. 1350–1450',
      garment: 'Houppelande & hennin',
      note: 'After the Black Death, survivors had more money and sumptuary laws tried to stop commoners dressing like nobles. Sleeves grew long enough to drag on the floor.',
    },
    {
      shape: 'elizabethan',
      name: 'Elizabethan',
      years: 'c. 1560–1600',
      garment: 'Wheel farthingale & ruff',
      note: 'Starch arrived in England around 1564, and ruffs ballooned so wide that diners needed extra-long spoons. Elizabeth I used her wardrobe as statecraft.',
    },
    {
      shape: 'rococo',
      name: 'Rococo',
      years: 'c. 1740–1780',
      garment: 'Robe à la française & panniers',
      note: 'Panniers pushed skirts out sideways until women turned to pass through doorways. Marie Antoinette’s towering poufs became symbols of royal excess.',
    },
    {
      shape: 'regency',
      name: 'Regency',
      years: 'c. 1795–1820',
      garment: 'Empire-waist muslin gown',
      shelf: 'seven Austen novels',
      note: 'After the French Revolution, fashion fled from corsets and silk toward Grecian simplicity. This is the world Jane Austen wrote in.',
    },
    {
      shape: 'crinoline',
      name: 'Mid-Victorian',
      years: 'c. 1850–1868',
      garment: 'Cage crinoline',
      note: 'Steel hoops replaced layers of petticoats. Freeing, but flammable: thousands died when skirts swept too close to an open fire.',
    },
    {
      shape: 'bustle',
      name: 'Late Victorian',
      years: 'c. 1870–1889',
      garment: 'The bustle',
      note: 'The fullness moved to the back, held up by wire, horsehair, or a collapsible cage. The Gothic revival and mourning dress were everywhere.',
    },
    {
      shape: 'edwardian',
      name: 'Edwardian',
      years: 'c. 1901–1914',
      garment: 'S-bend corset & picture hat',
      shelf: 'East of Eden, set in these very years',
      note: 'The “Gibson Girl” silhouette pushed the bust forward and the hips back. Hats were so laden with plumage that bird-protection laws followed.',
    },
    {
      shape: 'flapper',
      name: 'Roaring Twenties',
      years: 'c. 1920–1929',
      garment: 'Drop-waist shift & cloche',
      note: 'After the First World War and suffrage, hemlines rose to the knee and corsets vanished. Women bobbed their hair and danced the Charleston.',
    },
  ],
}
