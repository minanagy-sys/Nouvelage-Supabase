export interface CartItem {
  id: string;
  type: 'service' | 'bundle';
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image?: string;
  branch?: string;
  doctor?: string;
  sessionDate?: Date;
  notes?: string;
}

export interface ServiceBundle {
  id: string;
  name: string;
  services: string[];
  price: number;
  originalPrice: number;
  discount: number;
  sessions: number;
  image?: string;
  description?: string;
  duration?: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  description: string;
  image?: string;
  forHer?: boolean;
  forHim?: boolean;
  benefits?: string[];
  procedure?: string;
  aftercare?: string;
}

export interface CheckoutData {
  items: CartItem[];
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    birthday?: string;
  };
  preferences: {
    branch: string;
    doctor?: string;
    preferredDate?: Date;
    preferredTime?: string;
  };
  payment: {
    method: 'cash' | 'card' | 'installment';
    cardDetails?: any;
  };
  total: number;
  discount?: number;
  notes?: string;
}
