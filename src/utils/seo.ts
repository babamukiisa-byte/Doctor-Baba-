import { BlogPost, Category } from '../types';
import { SERVICE_DESCRIPTIONS, REGIONAL_SEO_CONTENT } from '../data/serviceDetails';
import { BASE_URL, getPathnameForState, slugify } from './routes';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  author?: string;
  noindex?: boolean;
  structuredData?: object;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1545232979-fbfd42e0188d?auto=format&fit=crop&w=1200&q=80';

/**
 * Utility to strip HTML tags from rich text descriptions
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Helper to update or create a meta tag in document head
 */
function setMetaTag(attrName: 'name' | 'property', attrValue: string, content: string) {
  if (typeof document === 'undefined') return;

  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Helper to update or create the canonical link tag
 */
function setCanonical(url: string) {
  if (typeof document === 'undefined') return;

  let element = document.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', url);
}

/**
 * Helper to update dynamic JSON-LD Schema structured data
 */
function setDynamicSchema(schemaObj?: object) {
  if (typeof document === 'undefined') return;

  const SCRIPT_ID = 'dynamic-seo-jsonld';
  let scriptEl = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

  if (!schemaObj) {
    if (scriptEl) scriptEl.remove();
    return;
  }

  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = SCRIPT_ID;
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }
  scriptEl.textContent = JSON.stringify(schemaObj);
}

/**
 * Dedicated function to dynamically update document title and all SEO meta tags
 */
export function updateSEO(config: SEOConfig) {
  if (typeof document === 'undefined') return;

  // 1. Update Document Title
  document.title = config.title;

  // 2. Meta Description
  setMetaTag('name', 'description', config.description);

  // 3. Meta Keywords
  if (config.keywords) {
    setMetaTag('name', 'keywords', config.keywords);
  }

  // 4. Robots indexing directives
  if (config.noindex) {
    setMetaTag('name', 'robots', 'noindex, nofollow');
  } else {
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  }

  // 5. OpenGraph / Social Sharing Tags
  setMetaTag('property', 'og:title', config.title);
  setMetaTag('property', 'og:description', config.description);
  setMetaTag('property', 'og:image', config.image || DEFAULT_IMAGE);
  setMetaTag('property', 'og:type', config.type || 'website');
  setMetaTag('property', 'og:url', config.url || BASE_URL);

  // 6. Twitter Card Tags
  setMetaTag('name', 'twitter:title', config.title);
  setMetaTag('name', 'twitter:description', config.description);
  setMetaTag('name', 'twitter:image', config.image || DEFAULT_IMAGE);
  setMetaTag('name', 'twitter:url', config.url || BASE_URL);

  // 7. Canonical URL
  setCanonical(config.url || BASE_URL);

  // 8. Dynamic JSON-LD Schema
  setDynamicSchema(config.structuredData);
}

/**
 * Generate specific SEO configuration based on view state
 */
export function getSEOForView(
  activeTab: string,
  selectedBlog: BlogPost | null,
  selectedCategory: Category | null,
  selectedServiceDetail: string | null
): SEOConfig {
  switch (activeTab) {
    case 'blog-detail': {
      if (selectedBlog) {
        const cleanDesc = selectedBlog.mini_description || stripHtml(selectedBlog.description).slice(0, 160);
        const articlePath = getPathnameForState('blog-detail', selectedBlog, null, null);
        const articleUrl = `${BASE_URL}${articlePath}`;
        return {
          title: `${selectedBlog.name} | Doctor Baba Mukisa Spiritual Blog`,
          description: cleanDesc.length > 160 ? `${cleanDesc.slice(0, 157)}...` : cleanDesc,
          keywords: `${selectedBlog.category_name || ''}, Doctor Baba Mukisa, spiritual guidance, relationship counseling, herbal wellness`,
          image: selectedBlog.feature_image || DEFAULT_IMAGE,
          url: articleUrl,
          type: 'article',
          publishedTime: selectedBlog.post_date,
          author: selectedBlog.author || 'Doctor Baba Mukisa',
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: selectedBlog.name,
            image: [selectedBlog.feature_image || DEFAULT_IMAGE],
            datePublished: selectedBlog.post_date || '2025-01-01',
            author: {
              '@type': 'Person',
              name: selectedBlog.author || 'Doctor Baba Mukisa',
              url: BASE_URL
            },
            publisher: {
              '@type': 'Organization',
              name: 'Doctor Baba Mukisa Temple Sanctuary',
              logo: {
                '@type': 'ImageObject',
                url: DEFAULT_IMAGE
              }
            },
            description: cleanDesc,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': articleUrl
            }
          }
        };
      }
      break;
    }

    case 'service-detail': {
      if (selectedServiceDetail) {
        const desc = 
          SERVICE_DESCRIPTIONS[selectedServiceDetail] || 
          REGIONAL_SEO_CONTENT[selectedServiceDetail] || 
          `Authentic ${selectedServiceDetail} rituals and ancestral consultations conducted by Doctor Baba Mukisa to restore balance, love, and protection.`;
        const servicePath = getPathnameForState('service-detail', null, null, selectedServiceDetail);
        const serviceUrl = `${BASE_URL}${servicePath}`;

        return {
          title: `${selectedServiceDetail} - Authentic Spiritual Consultations | Doctor Baba Mukisa`,
          description: desc.length > 160 ? `${desc.slice(0, 157)}...` : desc,
          keywords: `${selectedServiceDetail}, authentic relationship guidance, traditional advisor Uganda, relationship reconciliation, Doctor Baba Mukisa`,
          image: DEFAULT_IMAGE,
          url: serviceUrl,
          type: 'website',
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: selectedServiceDetail,
            serviceType: 'Spiritual Consultation & Traditional Healing',
            provider: {
              '@type': 'Person',
              name: 'Doctor Baba Mukisa',
              telephone: '+256761359634',
              url: BASE_URL
            },
            description: desc,
            url: serviceUrl
          }
        };
      }
      break;
    }

    case 'category-detail': {
      if (selectedCategory) {
        const catDesc = selectedCategory.description || `Specialized ${selectedCategory.name} spiritual rituals, articles, and herbal consultations by Doctor Baba Mukisa.`;
        const catPath = getPathnameForState('category-detail', null, selectedCategory, null);
        const catUrl = `${BASE_URL}${catPath}`;

        return {
          title: `${selectedCategory.name} - Spiritual Services & Wisdom | Doctor Baba Mukisa`,
          description: catDesc.length > 160 ? `${catDesc.slice(0, 157)}...` : catDesc,
          keywords: `${selectedCategory.name}, spiritual rituals, traditional healing, herbal guidance, Doctor Baba Mukisa`,
          image: selectedCategory.featured_image || DEFAULT_IMAGE,
          url: catUrl,
          type: 'website',
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: selectedCategory.name,
            description: catDesc,
            url: catUrl
          }
        };
      }
      break;
    }

    case 'blog': {
      return {
        title: 'Spiritual Wisdom, Traditional Practices & Healing Blog | Doctor Baba Mukisa',
        description: 'Read authentic articles on African spiritual traditions, relationship reconciliation, marriage harmony, sacred herbal remedies, and ancestral guidance.',
        keywords: 'spiritual blog, traditional relationship guidance, herbal remedy articles, ancestral guidance blog, Doctor Baba Mukisa blog',
        url: `${BASE_URL}/blog`,
        type: 'website'
      };
    }

    case 'services': {
      return {
        title: 'Spiritual Services & Sacred Ancestral Traditions | Doctor Baba Mukisa',
        description: 'Discover authentic spiritual services: Relationship Reconciliation, Marriage Harmony, Career & Business Guidance, Spiritual Protection, and Traditional Herbal Knowledge in Kampala.',
        keywords: 'spiritual guidance services, relationship reconciliation, marriage harmony, prosperity guidance, traditional healer Kampala Uganda',
        url: `${BASE_URL}/services`,
        type: 'website'
      };
    }

    case 'about': {
      return {
        title: 'About Doctor Baba Mukisa - African Herbalist & Ancestral Lineage',
        description: 'Learn about Doctor Baba Mukisa, a respected African traditional herbalist and ancestral guidance practitioner with decades of sacred healing experience in Kampala, Uganda.',
        keywords: 'About Doctor Baba Mukisa, African herbalist history, Digo ancestral lineage, traditional medicine master, Kampala spiritual temple',
        url: `${BASE_URL}/about`,
        type: 'website'
      };
    }

    case 'contact': {
      return {
        title: 'Contact Doctor Baba Mukisa - Temple Consultation & WhatsApp',
        description: 'Book a confidential spiritual consultation with Doctor Baba Mukisa in Kampala, Uganda, or connect directly on WhatsApp +256761359634 for distance guidance.',
        keywords: 'Contact Doctor Baba Mukisa, WhatsApp spiritual advisor, book consultation Kampala, traditional healer phone number',
        url: `${BASE_URL}/contact`,
        type: 'website'
      };
    }

    case 'videos': {
      return {
        title: 'Sacred Ritual Videos & Ancestral Teachings | Doctor Baba Mukisa',
        description: 'Watch authentic spiritual ceremonies, herbal preparations, and client blessings recorded live at Doctor Baba Mukisa\'s temple sanctuary.',
        keywords: 'spiritual ritual videos, African healer ceremonies, traditional medicine videos, Doctor Baba Mukisa sanctuary',
        url: `${BASE_URL}/videos`,
        type: 'website'
      };
    }

    case 'gallery': {
      return {
        title: 'Sanctuary & Sacred Herbal Gallery | Doctor Baba Mukisa',
        description: 'Explore photo captures of Doctor Baba Mukisa\'s spiritual temple, sacred shrines, consecrated artifacts, and herbal remedies in Kampala, Uganda.',
        keywords: 'spiritual temple photos, African altar gallery, herbal remedies pictures, Doctor Baba Mukisa',
        url: `${BASE_URL}/gallery`,
        type: 'website'
      };
    }

    case 'admin': {
      return {
        title: 'Temple Administration Dashboard & Management | Doctor Baba Mukisa',
        description: 'Doctor Baba Mukisa spiritual temple content administration portal, publications management, and consultation logs.',
        keywords: 'Doctor Baba Mukisa admin, temple dashboard, spiritual sanctuary portal',
        url: `${BASE_URL}/admin`,
        noindex: false
      };
    }

    case 'home':
    default: {
      return {
        title: 'Doctor Baba Mukisa - African Traditional Herbalist & Spiritual Guidance Sanctuary',
        description: 'Official sanctuary of Doctor Baba Mukisa. Authentic African traditional herbalist, ancestral guidance practitioner, and spiritual advisor for relationship harmony, traditional healing, and mindfulness in Kampala, Uganda.',
        keywords: 'Doctor Baba Mukisa, traditional herbalist Uganda, relationship reconciliation, marriage harmony, spiritual cleansing Africa, traditional healing, prosperity consultations, traditional advisor Kampala',
        image: DEFAULT_IMAGE,
        url: `${BASE_URL}/`,
        type: 'website'
      };
    }
  }
}
