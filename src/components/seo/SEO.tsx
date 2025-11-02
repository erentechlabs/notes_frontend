import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  type?: 'website' | 'article';
  image?: string;
  url?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
  };
}

export default function SEO({
  title,
  description,
  type = 'website',
  image = 'https://www.notefade.com/og-image.png',
  url = 'https://www.notefade.com/',
  article,
}: SEOProps) {
  const fullTitle = `${title} | NoteFade`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Article specific meta tags */}
      {type === 'article' && article && (
        <>
          {article.publishedTime && (
            <meta property="article:published_time" content={article.publishedTime} />
          )}
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.author && <meta property="article:author" content={article.author} />}
        </>
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
