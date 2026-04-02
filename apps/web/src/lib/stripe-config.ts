const isLive = (process.env.STRIPE_SECRET_KEY ?? "").startsWith("sk_live_");

export const STRIPE_IDS = isLive
  ? {
      subscription: {
        productId: "prod_UG9hAT6phE29C0",
        basePriceId: "price_1THdNt3uBUfrZCbdsVSexRa0",
        overagePriceId: "price_1THdOE3uBUfrZCbdpf1mDo1i",
        meterId: "mtr_61UR1LQR1lQaIaDuW413uBUfrZCbd0ds",
        meterEventName: "wdl_overage_lbs",
      },
      singleOrder: {
        productId: "prod_UG9h7B9gmI593L",
      },
    }
  : {
      subscription: {
        productId: "prod_UG0lAckijhXdgv",
        basePriceId: "price_1THUjU3uBUfrZCbd0l4sg0Fa",
        overagePriceId: "price_1THUjU3uBUfrZCbddHw0rOhH",
        meterId: "mtr_test_61UQsgqnQW0C1ccZ8413uBUfrZCbdXyS",
        meterEventName: "wdl_overage_lbs",
      },
      singleOrder: {
        productId: "prod_UG0lZlCA5LXvNI",
      },
    };
