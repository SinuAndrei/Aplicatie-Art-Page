const textDataExhibForm = [
  {
    name: 'title',
    placeHolder: 'Your exhibition title',
    type: 'text',
    label: 'Title',
  },
  {
    name: 'category',
    placeHolder: 'Your exhibition category',
    type: 'text',
    label: 'Category',
  },
  {
    name: 'description',
    placeHolder: 'Your exhibition description',
    type: 'textarea',
    label: 'Description',
  },
  {
    name: 'image',
    type: 'file',
    label: 'Image',
  },
  {
    name: 'imageProducts',
    type: 'file',
    multiple: true,
    label: 'Products Images',
  },
];

const textDataProductForm = [
  {
    name: 'title',
    placeHolder: 'Your art title',
    type: 'text',
    label: 'Title',
  },
  {
    name: 'artType',
    type: 'select',
    options: ['painting', 'drawing'],
    label: 'Art Type',
  },
  {
    name: 'collection',
    placeHolder: 'Your art collection',
    type: 'text',
    label: 'Collection',
  },
  {
    name: 'description',
    placeHolder: 'Your art description',
    type: 'textarea',
    label: 'Description',
  },
  {
    name: 'fabricationYear',
    placeHolder: 'Your art fabrication year',
    type: 'number',
    label: 'Fabrication Year',
  },
  {
    name: 'image',
    type: 'file',
    label: 'Image',
  },
];

const navLinksData = [
  { href: '/paintings', label: 'PAINTINGS' },
  { href: '/drawings', label: 'DRAWINGS' },
  { href: '/exhibitions', label: 'EXHIBITIONS' },
  { href: '/contact', label: 'CONTACT' },
];

const authNavLinksData = [
  { href: '/add-product', label: 'ADD PRODUCT' },
  { href: '/add-exhib', label: 'ADD EXHIBITIONS' },
];

const contactDataForm = [
  {
    name: 'firstName',
    type: 'text',
    label: 'First Name',
    required: true,
  },
  {
    name: 'lastName',
    type: 'text',
    label: 'Last Name',
    required: true,
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    required: true,
  },
  {
    name: 'phone',
    type: 'tel',
    label: 'Phone Number',
    required: true,
  },
  {
    name: 'message',
    type: 'textarea',
    label: 'Message',
    required: true,
  },
];

export {
  textDataExhibForm,
  textDataProductForm,
  navLinksData,
  authNavLinksData,
  contactDataForm,
};
