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
