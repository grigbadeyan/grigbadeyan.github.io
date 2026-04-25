export type Locale = 'hy' | 'ru' | 'en'

export const locales: Locale[] = ['hy', 'ru', 'en']
export const defaultLocale: Locale = 'hy'

export const localeNames: Record<Locale, string> = {
  hy: 'Հայ',
  ru: 'Рус',
  en: 'Eng',
}

export const translations = {
  hy: {
    siteName: 'Ծղոտներ',
    siteTagline: 'Սաունա-Հյուրանոցային Համալիր',
    nav: {
      home: 'Գլխավոր',
      rooms: 'Սենյակներ',
      gallery: 'Պատկերասրահ',
      about: 'Մեր Մասին',
      contact: 'Կապ',
      reservation: 'Ամրագրում',
    },
    hero: {
      title: 'Ծղոտներ',
      subtitle: 'Սաունա-Հյուրանոցային Համալիր',
      description: 'Անմոռանալի հանգիստ Երևանի սրտում',
      cta: 'Ամրագրել',
      explore: 'Ուսումնասիրել',
    },
    reservation: {
      title: 'Ամրագրում',
      name: 'Անուն',
      phone: 'Հեռախոս',
      email: 'Էլ. փոստ',
      room: 'Սենյակ',
      message: 'Հաղորդագրություն',
      send: 'Ուղարկել',
      success: 'Ձեր հայտը ստացվել է: Կապ կհաստատենք շուտով:',
      selectRoom: 'Ընտրեք սենյակ',
    },
    about: {
      title: 'Մեր Մասին',
    },
    contact: {
      title: 'Կապ',
      address: 'Հասցե',
      phone: 'Հեռախոս',
      hours: 'Աշխատանքային ժամեր',
      hoursValue: '24/7',
    },
    footer: {
      rights: 'Բոլոր իրավունքները պաշտպանված են',
    },
    price: 'AMD / ժամ',
    perHour: 'ժամ',
    viewRoom: 'Դիտել',
    bookNow: 'Ամրագրել',
    capacity: 'Հոգի',
    area: 'մ²',
    features: 'Հարմարություններ',
    rooms: 'Սենյակներ',
    loading: 'Բեռնվում է...',
  },
  ru: {
    siteName: 'Цхотнер',
    siteTagline: 'Сауна-Отель Комплекс',
    nav: {
      home: 'Главная',
      rooms: 'Номера',
      gallery: 'Галерея',
      about: 'О нас',
      contact: 'Контакт',
      reservation: 'Бронирование',
    },
    hero: {
      title: 'Цхотнер',
      subtitle: 'Сауна-Отель Комплекс',
      description: 'Незабываемый отдых в сердце Еревана',
      cta: 'Забронировать',
      explore: 'Исследовать',
    },
    reservation: {
      title: 'Бронирование',
      name: 'Имя',
      phone: 'Телефон',
      email: 'E-mail',
      room: 'Номер',
      message: 'Сообщение',
      send: 'Отправить',
      success: 'Ваша заявка получена. Мы свяжемся с вами скоро.',
      selectRoom: 'Выберите номер',
    },
    about: {
      title: 'О нас',
    },
    contact: {
      title: 'Контакт',
      address: 'Адрес',
      phone: 'Телефон',
      hours: 'Часы работы',
      hoursValue: '24/7',
    },
    footer: {
      rights: 'Все права защищены',
    },
    price: 'AMD / час',
    perHour: 'час',
    viewRoom: 'Смотреть',
    bookNow: 'Забронировать',
    capacity: 'Человек',
    area: 'м²',
    features: 'Удобства',
    rooms: 'Номера',
    loading: 'Загрузка...',
  },
  en: {
    siteName: 'Tsghotner',
    siteTagline: 'Sauna-Hotel Complex',
    nav: {
      home: 'Home',
      rooms: 'Rooms',
      gallery: 'Gallery',
      about: 'About Us',
      contact: 'Contact',
      reservation: 'Reservation',
    },
    hero: {
      title: 'Tsghotner',
      subtitle: 'Sauna-Hotel Complex',
      description: 'Unforgettable recreation in the heart of Yerevan',
      cta: 'Book Now',
      explore: 'Explore',
    },
    reservation: {
      title: 'Reservation',
      name: 'Name',
      phone: 'Phone',
      email: 'Email',
      room: 'Room',
      message: 'Message',
      send: 'Send',
      success: 'Your request has been received. We will contact you soon.',
      selectRoom: 'Select a room',
    },
    about: {
      title: 'About Us',
    },
    contact: {
      title: 'Contact',
      address: 'Address',
      phone: 'Phone',
      hours: 'Working Hours',
      hoursValue: '24/7',
    },
    footer: {
      rights: 'All rights reserved',
    },
    price: 'AMD / hour',
    perHour: 'hour',
    viewRoom: 'View',
    bookNow: 'Book Now',
    capacity: 'Guests',
    area: 'm²',
    features: 'Features',
    rooms: 'Rooms',
    loading: 'Loading...',
  },
}

export function t(locale: Locale) {
  return translations[locale]
}

export function getLocalizedField<T extends Record<string, unknown>>(
  obj: T,
  field: string,
  locale: Locale
): string {
  return (obj[`${field}_${locale}`] as string) || (obj[`${field}_en`] as string) || ''
}
