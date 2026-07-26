export type PizzaCategory = 'tradicional' | 'especial' | 'doce';

export interface PizzaSize {
  id: string;
  name: string;
  description: string;
  slices: number;
  maxFlavors: number;
  basePrice: number;
  recommendedFor: string;
}

export interface PizzaFlavor {
  id: string;
  name: string;
  description: string;
  category: PizzaCategory;
  priceModifier: number; // Additional cost on top of base price
  image: string;
  ingredients: string[];
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isPopular?: boolean;
}

export interface StuffedCrust {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
}

export type SideCategory = 'bebida' | 'acompanhamento' | 'sobremesa' | 'molho' | 'combo';

export interface SideItem {
  id: string;
  name: string;
  category: SideCategory;
  price: number;
  description: string;
  image: string;
  volumeOrUnit?: string;
  isPopular?: boolean;
}

export interface ComboItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  pizzaSizeId: string;
  includedFlavorsCount: number;
  crustIncludedId?: string;
  includedSideId?: string;
}

export interface SelectedPizza {
  size: PizzaSize;
  flavors: PizzaFlavor[];
  crust: StuffedCrust;
  doughType: 'tradicional' | 'fina' | 'pan';
  customNotes?: string;
  extraCheese?: boolean;
}

export interface CartItem {
  id: string;
  type: 'pizza' | 'side' | 'combo';
  pizzaDetails?: SelectedPizza;
  sideDetails?: {
    item: SideItem;
    notes?: string;
  };
  comboDetails?: {
    combo: ComboItem;
    selectedFlavors: PizzaFlavor[];
    selectedCrust: StuffedCrust;
    selectedSide?: SideItem;
    notes?: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type DeliveryType = 'delivery' | 'retirada';
export type PaymentMethod = 'pix' | 'cartao_entrega' | 'dinheiro';

export interface CustomerDetails {
  name: string;
  phone: string;
  deliveryType: DeliveryType;
  street: string;
  number: string;
  neighborhood: string;
  complement?: string;
  referencePoint?: string;
  paymentMethod: PaymentMethod;
  changeFor?: string; // If cash payment
  notes?: string;
  isScheduled?: boolean;
  scheduledDate?: string;
  scheduledTime?: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minOrderValue: number;
}
