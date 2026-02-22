export type CustomerInfo = any;

export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  return null;
};

export const isPremiumActive = (_customerInfo: CustomerInfo): boolean => {
  return false;
};

export const getCurrentOffering = async (): Promise<any | null> => {
  return null;
};

export const getPackageByType = async (_type: 'monthly' | 'weekly' | 'yearly'): Promise<any | null> => {
  return null;
};

export const purchasePackage = async (_pkg: any): Promise<void> => {
  const err: any = new Error('Purchases not configured');
  err.code = 'unavailable';
  throw err;
};
