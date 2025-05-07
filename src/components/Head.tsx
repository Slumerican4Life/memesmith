
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface HeadProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  url?: string;
}

const Head: React.FC<HeadProps> = ({ 
  title = 'MemeSmith - Make It. Meme It. Share It.',
  description = 'Create, download, and share your own custom memes with MemeSmith - the web\'s easiest meme generator.',
  image = 'https://lovable.dev/opengraph-image-p98pqg.png',
  type = 'website',
  url = window.location.href
}) => {
  const siteTitle = title.includes('MemeSmith') ? title : `${title} | MemeSmith`;
  
  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@memesmith" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default Head;
