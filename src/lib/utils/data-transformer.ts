/**
 * Data Transformation Utilities
 * 
 * Utilities for transforming data between Hillfog backend format and Next.js UI format.
 */

/**
 * Transform BigDecimal string to number
 */
export function mapBigDecimalToNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Transform number to BigDecimal string format
 */
export function mapNumberToBigDecimal(value: number | null | undefined): string {
  if (value === null || value === undefined) return '0';
  return value.toString();
}

/**
 * Transform Hillfog date string to ISO format
 */
export function mapDateToISO(dateString: string | null | undefined): string | undefined {
  if (!dateString) return undefined;
  
  try {
    // Handle different date formats from Hillfog
    // Format: "yyyy-MM-dd HH:mm:ss" or "yyyyMMddHHmmss"
    let date: Date;
    
    if (dateString.includes('-') && dateString.includes(':')) {
      // Standard format: "2023-12-01 10:30:00"
      date = new Date(dateString);
    } else if (dateString.length === 14) {
      // Compact format: "20231201103000"
      const year = parseInt(dateString.substring(0, 4));
      const month = parseInt(dateString.substring(4, 6)) - 1; // Month is 0-indexed
      const day = parseInt(dateString.substring(6, 8));
      const hour = parseInt(dateString.substring(8, 10));
      const minute = parseInt(dateString.substring(10, 12));
      const second = parseInt(dateString.substring(12, 14));
      
      date = new Date(year, month, day, hour, minute, second);
    } else {
      // Try parsing as-is
      date = new Date(dateString);
    }
    
    return date.toISOString();
  } catch (error) {
    console.warn('Failed to parse date:', dateString, error);
    return undefined;
  }
}

/**
 * Transform ISO date to Hillfog date string format
 */
export function mapISOToHillfogDate(isoString: string | null | undefined): string | undefined {
  if (!isoString) return undefined;
  
  try {
    const date = new Date(isoString);
    
    // Format as "yyyy-MM-dd HH:mm:ss"
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  } catch (error) {
    console.warn('Failed to format date:', isoString, error);
    return undefined;
  }
}

/**
 * Transform Hillfog boolean values
 */
export function mapHillfogBoolean(value: string | boolean | null | undefined): boolean {
  if (typeof value === 'boolean') return value;
  if (!value) return false;
  
  const stringValue = value.toString().toLowerCase();
  return stringValue === 'true' || stringValue === 'y' || stringValue === '1';
}

/**
 * Transform boolean to Hillfog format
 */
export function mapBooleanToHillfog(value: boolean | null | undefined): string {
  return value ? 'Y' : 'N';
}

/**
 * Clean and validate string values
 */
export function cleanString(value: string | null | undefined): string {
  if (!value) return '';
  return value.toString().trim();
}

/**
 * Transform Hillfog frequency codes to readable format
 */
export function mapFrequencyCode(code: string | null | undefined): string {
  if (!code) return '';
  
  const frequencyMap: Record<string, string> = {
    'D': 'Daily',
    'W': 'Weekly', 
    'M': 'Monthly',
    'Q': 'Quarterly',
    'H': 'Half-yearly',
    'Y': 'Yearly',
  };
  
  return frequencyMap[code.toUpperCase()] || code;
}

/**
 * Transform readable frequency to Hillfog code
 */
export function mapFrequencyToCode(frequency: string | null | undefined): string {
  if (!frequency) return '';
  
  const codeMap: Record<string, string> = {
    'daily': 'D',
    'weekly': 'W',
    'monthly': 'M', 
    'quarterly': 'Q',
    'half-yearly': 'H',
    'yearly': 'Y',
  };
  
  return codeMap[frequency.toLowerCase()] || frequency;
}

/**
 * Transform Hillfog management type codes
 */
export function mapManagementType(code: string | null | undefined): string {
  if (!code) return '';
  
  const managementMap: Record<string, string> = {
    '1': 'Higher is better',
    '2': 'Lower is better',
    '3': 'Closer to target is better',
  };
  
  return managementMap[code] || code;
}

/**
 * Transform Hillfog compare type codes
 */
export function mapCompareType(code: string | null | undefined): string {
  if (!code) return '';
  
  const compareMap: Record<string, string> = {
    '1': 'Greater than or equal',
    '2': 'Less than or equal',
    '3': 'Equal',
    '4': 'Between',
  };
  
  return compareMap[code] || code;
}

/**
 * Transform Hillfog data type codes
 */
export function mapDataType(code: string | null | undefined): string {
  if (!code) return '';
  
  const dataTypeMap: Record<string, string> = {
    '1': 'Number',
    '2': 'Percentage',
    '3': 'Currency',
  };
  
  return dataTypeMap[code] || code;
}

/**
 * Generic entity transformer for common Hillfog fields
 */
export function transformHillfogEntity<T extends Record<string, any>>(entity: any): T {
  if (!entity) return entity;
  
  const transformed = { ...entity };
  
  // Transform common fields
  if (entity.oid) {
    transformed.id = entity.oid;
    delete transformed.oid;
  }
  
  if (entity.cdateString) {
    transformed.createdDate = mapDateToISO(entity.cdateString);
  }
  
  if (entity.udateString) {
    transformed.updatedDate = mapDateToISO(entity.udateString);
  }
  
  if (entity.cdate) {
    transformed.createdDate = mapDateToISO(entity.cdate);
  }
  
  if (entity.udate) {
    transformed.updatedDate = mapDateToISO(entity.udate);
  }
  
  // Transform numeric fields
  ['weight', 'target', 'max', 'min', 'actual', 'score'].forEach(field => {
    if (entity[field] !== undefined) {
      transformed[field] = mapBigDecimalToNumber(entity[field]);
    }
  });
  
  // Transform boolean fields
  ['active', 'enabled', 'visible'].forEach(field => {
    if (entity[field] !== undefined) {
      transformed[field] = mapHillfogBoolean(entity[field]);
    }
  });
  
  // Clean string fields
  ['name', 'description', 'content', 'mission', 'unit'].forEach(field => {
    if (entity[field] !== undefined) {
      transformed[field] = cleanString(entity[field]);
    }
  });
  
  return transformed as T;
}

/**
 * Transform entity back to Hillfog format
 */
export function transformToHillfogFormat<T extends Record<string, any>>(entity: T): any {
  if (!entity) return entity;
  
  const transformed = { ...entity };
  
  // Transform common fields back
  if (entity.id && !entity.oid) {
    transformed.oid = entity.id;
    delete transformed.id;
  }
  
  if (entity.createdDate && !entity.cdateString) {
    transformed.cdateString = mapISOToHillfogDate(entity.createdDate);
  }
  
  if (entity.updatedDate && !entity.udateString) {
    transformed.udateString = mapISOToHillfogDate(entity.updatedDate);
  }
  
  // Transform numeric fields back to strings
  ['weight', 'target', 'max', 'min', 'actual', 'score'].forEach(field => {
    if (entity[field] !== undefined) {
      transformed[field] = mapNumberToBigDecimal(entity[field]);
    }
  });
  
  // Transform boolean fields back
  ['active', 'enabled', 'visible'].forEach(field => {
    if (entity[field] !== undefined) {
      transformed[field] = mapBooleanToHillfog(entity[field]);
    }
  });
  
  return transformed;
}

/**
 * Validate required fields for Hillfog entities
 */
export function validateHillfogEntity(entity: any, requiredFields: string[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  requiredFields.forEach(field => {
    if (!entity[field] || (typeof entity[field] === 'string' && entity[field].trim() === '')) {
      errors.push(`${field} is required`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Format display values for UI
 */
export function formatDisplayValue(value: any, type: 'number' | 'percentage' | 'currency' | 'date' = 'number'): string {
  if (value === null || value === undefined) return '';
  
  switch (type) {
    case 'number':
      return typeof value === 'number' ? value.toLocaleString() : value.toString();
    
    case 'percentage':
      const numValue = typeof value === 'number' ? value : parseFloat(value);
      return isNaN(numValue) ? '' : `${numValue.toFixed(2)}%`;
    
    case 'currency':
      const currValue = typeof value === 'number' ? value : parseFloat(value);
      return isNaN(currValue) ? '' : new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(currValue);
    
    case 'date':
      try {
        const date = new Date(value);
        return date.toLocaleDateString();
      } catch {
        return value.toString();
      }
    
    default:
      return value.toString();
  }
}