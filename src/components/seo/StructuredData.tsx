import { Helmet } from 'react-helmet-async';

interface WebsiteSchemaProps {
  type: 'website';
}

interface ArticleSchemaProps {
  type: 'article';
  title: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  url: string;
}

type StructuredDataProps = WebsiteSchemaProps | ArticleSchemaProps;

export default function StructuredData(props: StructuredDataProps) {
  const getSchema = () => {
    if (props.type === 'website') {
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'NoteFade',
        description: 'Create, share, and organize your notes effortlessly.',
        url: 'https://www.notefade.com',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://www.notefade.com/note/{search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      };
    }

    if (props.type === 'article') {
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: props.title,
        description: props.description,
        url: props.url,
        datePublished: props.datePublished,
        dateModified: props.dateModified || props.datePublished,
        author: props.author
          ? {
              '@type': 'Person',
              name: props.author,
            }
          : undefined,
        publisher: {
          '@type': 'Organization',
          name: 'NoteFade',
          logo: {
            '@type': 'ImageObject',
            url: 'https://www.notefade.com/favicon.png',
          },
        },
      };
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(getSchema())}</script>
    </Helmet>
  );
}
