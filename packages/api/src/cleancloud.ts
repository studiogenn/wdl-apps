export type RouteResult = {
  readonly routeID: number;
  readonly routeName?: string;
};

export type DateEntry = {
  readonly date: number;
  readonly slots?: string;
  readonly remaining?: number;
};

export type Product = {
  readonly productID: number;
  readonly name: string;
  readonly price: number;
};

export type OrderResult = {
  readonly orderID: number;
};

export type CreateOrderParams = {
  readonly customerID: number;
  readonly pickupDate?: number;
  readonly pickupStart?: string;
  readonly pickupEnd?: string;
  readonly deliveryDate?: number;
  readonly deliveryStart?: string;
  readonly deliveryEnd?: string;
  readonly products?: readonly { readonly productID: number; readonly quantity: number }[];
  readonly orderNotes?: string;
  readonly finalTotal?: number;
};

// 0=Cleaning, 1=Ready, 2=Completed, 3=Pickup Requiring Confirmation, 4=Accepted Pickup, 5=Detailing
export type OrderStatus = 0 | 1 | 2 | 3 | 4 | 5;

export type Order = {
  readonly orderID: number;
  readonly customerID: number;
  readonly status: OrderStatus;
  readonly finalTotal: number;
  readonly discount?: number;
  readonly deliveryFee?: number;
  readonly tax?: number;
  readonly tip?: number;
  readonly pickupDate?: number;
  readonly pickupStart?: string;
  readonly pickupEnd?: string;
  readonly deliveryDate?: number;
  readonly deliveryStart?: string;
  readonly deliveryEnd?: string;
  readonly products?: readonly {
    readonly id: number;
    readonly name: string;
    readonly price: number;
    readonly quantity: number;
    readonly pieces: number;
  }[];
  readonly orderNotes?: string;
  readonly paid?: 0 | 1;
  readonly express?: 0 | 1;
  readonly completed?: 0 | 1;
};
