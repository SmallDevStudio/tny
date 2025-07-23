import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";

export default function Header({ title, description }) {
  const router = useRouter();

  // ✅ กำหนดค่า Default SEO
  const defaultTitle = "The New You Academy";
  const fullTitle = title ? `${defaultTitle} | ${title}` : defaultTitle;
  const metaDescription =
    description || "เรียนรู้และพัฒนาตัวเองกับ The New You Academy";

  const ogImageUrl = `${process.env.NEXT_PUBLIC_API_URL}/opengraph-image?pathname=${router.asPath}`;

  return (
    <Head>
      {/* ✅ Dynamic Title */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />

      {/* ✅ Favicon & Theme */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="manifest" href="/site.webmanifest" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicon/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon/favicon-16x16.png"
      />

      {/* ✅ SEO */}

      {/* ✅ Open Graph / Facebook */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content={`https://www.thenewyouacademy.com${router.asPath}`}
      />
      <meta property="og:image" content="{ogImageUrl}" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* ✅ Twitter Meta */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content="{ogImageUrl}" />

      {/* ✅ Google Site Verification */}
      <meta
        name="google-site-verification"
        content="google-site-verification=google-site-verification=google-site-verification"
      />

      {/* ✅ Google Analytics */}
      <Script
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-WQXH48SP');`,
        }}
      />
    </Head>
  );
}
