/* ==========================================================================
   ZAIQA — Menu data (shared by home, menu, cart & gallery pages)
   ========================================================================== */

window.CATEGORIES = [
  { id: 'all',       label: 'All Dishes'  },
  { id: 'starters',  label: 'Starters'    },
  { id: 'mains',     label: 'Main Course' },
  { id: 'breads',    label: 'Breads'      },
  { id: 'desserts',  label: 'Desserts'    },
  { id: 'beverages', label: 'Beverages'   }
];

window.MENU = [
  /* ---------- Starters ---------- */
  { id:'paneer-tikka', name:'Angara Paneer Tikka', cat:'starters', price:320, veg:true,  rating:4.8,
    img:'assets/img/paneer-tikka.jpg', tags:['spicy'],
    desc:'Char-grilled cottage cheese in a smoked red-chilli marinade, mint chutney, pickled onions.' },
  { id:'tandoori-murgh', name:'Tandoori Murgh (Half)', cat:'starters', price:420, veg:false, rating:4.9,
    img:'assets/img/tandoori.jpg', tags:['spicy','popular'],
    desc:'Overnight yoghurt-and-spice marinated chicken, blistered in our clay tandoor.' },
  { id:'seekh-kebab', name:'Lucknowi Seekh Kebab', cat:'starters', price:460, veg:false, rating:4.7,
    img:'assets/img/seekh-kebab.jpg', tags:[],
    desc:'Hand-minced lamb with saffron & rose petals, smoked over live charcoal.' },
  { id:'crispy-corn', name:'Crispy Corn Salt & Pepper', cat:'starters', price:260, veg:true, rating:4.6,
    img:'assets/img/crispy-corn.jpg', tags:['spicy'],
    desc:'Golden fried corn tossed with burnt garlic, peppers and curry-leaf salt.' },

  /* ---------- Main course ---------- */
  { id:'butter-chicken', name:'Old Delhi Butter Chicken', cat:'mains', price:460, veg:false, rating:4.9,
    img:'assets/img/butter-chicken.jpg', tags:['signature','popular'],
    desc:'Tandoor-roasted chicken folded into velvety tomato-makhan gravy, finished with white butter.' },
  { id:'dum-biryani', name:'Hyderabadi Dum Biryani', cat:'mains', price:520, veg:false, rating:5.0,
    img:'assets/img/biryani.jpg', tags:['signature','popular'],
    desc:'Aged basmati layered with saffron, mint and slow-cooked chicken, sealed and steamed on dum.' },
  { id:'rogan-josh', name:'Kashmiri Rogan Josh', cat:'mains', price:540, veg:false, rating:4.8,
    img:'assets/img/rogan-josh.jpg', tags:['spicy'],
    desc:'Slow-braised lamb in a deep Kashmiri chilli & fennel gravy — fiery, fragrant, royal.' },
  { id:'murgh-korma', name:'Shahi Murgh Korma', cat:'mains', price:440, veg:false, rating:4.7,
    img:'assets/img/murgh-korma.jpg', tags:[],
    desc:'Chicken simmered in a cashew–melon seed gravy kissed with kewra water.' },
  { id:'dal-makhani', name:'Dal Makhani “48 Hours”', cat:'mains', price:340, veg:true, rating:4.9,
    img:'assets/img/dal-makhani.jpg', tags:['signature'],
    desc:'Black urad lentils simmered two full days on embers, finished with cream and white butter.' },
  { id:'palak-paneer', name:'Palak Paneer Lasooni', cat:'mains', price:360, veg:true, rating:4.6,
    img:'assets/img/palak-paneer.jpg', tags:[],
    desc:'Silky spinach purée, seared paneer, smoky garlic tadka and a swirl of cream.' },

  /* ---------- Breads ---------- */
  { id:'butter-naan', name:'Butter Naan', cat:'breads', price:80, veg:true, rating:4.8,
    img:'assets/img/bread-naan.jpg', tags:[],
    desc:'Pillow-soft leavened bread from the tandoor wall, brushed generously with ghee.' },
  { id:'laccha-paratha', name:'Mirchi Laccha Paratha', cat:'breads', price:95, veg:true, rating:4.7,
    img:'assets/img/laccha-paratha.jpg', tags:[],
    desc:'Sixteen flaky whole-wheat layers dusted with crushed pepper, baked till shattering-crisp.' },
  { id:'bread-basket', name:'Assorted Tandoori Basket', cat:'breads', price:220, veg:true, rating:4.7,
    img:'assets/img/bread-basket.jpg', tags:[],
    desc:'A woven basket of butter naan, roti and parathas — enough for the whole table.' },

  /* ---------- Desserts ---------- */
  { id:'gulab-royale', name:'Gulab Jamun Royale', cat:'desserts', price:240, veg:true, rating:4.9,
    img:'assets/img/dessert-gulab.jpg', tags:['signature','popular'],
    desc:'Rose-syrup dumplings plated with saffron rabri, pistachio dust and edible gold.' },
  { id:'kesar-phirni', name:'Kesar Phirni', cat:'desserts', price:180, veg:true, rating:4.7,
    img:'assets/img/dessert-phirni.jpg', tags:[],
    desc:'Ground-rice pudding set in earthen kulhads, perfumed with Kashmiri saffron.' },
  { id:'rasmalai', name:'Kesar Rasmalai', cat:'desserts', price:260, veg:true, rating:4.8,
    img:'assets/img/rasmalai.jpg', tags:[],
    desc:'Cloud-soft chenna discs soaked overnight in saffron-cardamom milk, silverleaf on top.' },

  /* ---------- Beverages ---------- */
  { id:'mango-lassi', name:'Alphonso Mango Lassi', cat:'beverages', price:160, veg:true, rating:4.8,
    img:'assets/img/lassi.jpg', tags:[],
    desc:'Ratnagiri alphonso pulp churned with creamy curd and a whisper of cardamom.' },
  { id:'kesar-badam-milk', name:'Kesar Badam Milk', cat:'beverages', price:180, veg:true, rating:4.7,
    img:'assets/img/kesar-milk.jpg', tags:[],
    desc:'Slow-reduced milk with almonds, saffron threads and rose — served warm or chilled.' }
];

/* dish id → dish object */
window.dishById = function (id) {
  return window.MENU.find(d => d.id === id) || null;
};
