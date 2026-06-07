export const STORE = {
  name: 'FreshMart Supermarket',
  address: 'Via Pietrino Brutti 13',
  city: 'Alba',
  province: 'CN',
  zip: '12051',
  country: 'Italia',
  phone: '+39 0173 876 5432',
  email: 'support@freshmart.it',
  hours: 'Lun–Sab: 7:00 – 22:00, Dom: 8:00 – 21:00',
};

export const STORE_ADDRESS_LINES = [
  STORE.address,
  `${STORE.zip} ${STORE.city} (${STORE.province})`,
  STORE.country,
];

export const STORE_ADDRESS_SINGLE = `${STORE.address}, ${STORE.zip} ${STORE.city}, ${STORE.country}`;

export const DELIVERY_FEE = 4.99;
export const FREE_DELIVERY_THRESHOLD = 50;

