import { PageSEO } from '@/lib/actions/seo/pagesSeoAction';

interface JsonLdSchemaProps {
  seoData: PageSEO | null;
}

/**
 * Component to render JSON-LD schema from WordPress SEO data
 */
export function JsonLdSchema({ seoData }: JsonLdSchemaProps) {
  if (!seoData?.schema?.raw) {
    return null;
  }

  try {
    // Parse the JSON-LD schema
    // The raw field might already be a stringified JSON
    let schema: any;
    
    if (typeof seoData.schema.raw === 'string') {
      // Try to parse the JSON string
      try {
        schema = JSON.parse(seoData.schema.raw);
      } catch (parseError) {
        console.error('JsonLdSchema: Failed to parse JSON string', parseError);
        console.error('Raw schema string (first 200 chars):', seoData.schema.raw.substring(0, 200));
        return null;
      }
    } else {
      // If it's already an object, use it directly
      schema = seoData.schema.raw;
    }

    // Validate that schema is an object
    if (!schema || typeof schema !== 'object') {
      console.error('JsonLdSchema: Invalid schema format - not an object', typeof schema);
      return null;
    }

    // Stringify the schema for injection
    const schemaJson = JSON.stringify(schema);
    
    if (!schemaJson || schemaJson === '{}') {
      console.warn('JsonLdSchema: Schema is empty after stringification');
      return null;
    }
    
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson }}
      />
    );
  } catch (error) {
    console.error('Error processing JSON-LD schema:', error);
    console.error('Raw schema data type:', typeof seoData.schema.raw);
    if (typeof seoData.schema.raw === 'string') {
      console.error('Raw schema data (first 500 chars):', seoData.schema.raw.substring(0, 500));
    } else {
      console.error('Raw schema data:', seoData.schema.raw);
    }
    return null;
  }
}

