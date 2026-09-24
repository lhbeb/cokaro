type LegalPageSchemaProps = {
  name: string;
  description: string;
  path: string;
};

export default function LegalPageSchema({ name, description, path }: LegalPageSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `https://cokaro.com${path}#webpage`,
    url: `https://cokaro.com${path}`,
    name,
    description,
    isPartOf: {
      '@type': 'WebSite',
      '@id': 'https://cokaro.com/#website',
      url: 'https://cokaro.com',
      name: 'Cokaro',
    },
    publisher: {
      '@type': 'Organization',
      '@id': 'https://cokaro.com/#organization',
      name: 'Cokaro',
      url: 'https://cokaro.com',
      email: 'contact@cokaro.com',
      telephone: '+1 (913) 593-7677',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '1239 N Washington Ave',
        addressLocality: 'Wichita',
        addressRegion: 'KS',
        postalCode: '67214',
        addressCountry: 'US',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
