import { NextResponse } from "next/server";
import { cleancloudRequest } from "@/lib/cleancloud/client";
import { CleanCloudApiError, getReadableError } from "@/lib/cleancloud/errors";

type Product = {
  readonly productID: number;
  readonly name: string;
  readonly price: number;
  readonly [key: string]: unknown;
};

type ProductsResponse = {
  readonly products?: ReadonlyArray<Product>;
  readonly [key: string]: unknown;
};

let cachedProducts: { data: ReadonlyArray<Product>; expiresAt: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function POST() {
  try {
    const now = Date.now();

    if (cachedProducts && cachedProducts.expiresAt > now) {
      return NextResponse.json({
        success: true,
        data: { products: cachedProducts.data },
      });
    }

    const data = await cleancloudRequest<ProductsResponse>("getProducts", {});

    const products = data.products ?? [];
    cachedProducts = { data: products, expiresAt: now + CACHE_TTL_MS };

    return NextResponse.json({
      success: true,
      data: { products },
    });
  } catch (error) {
    // Serve stale cache if available
    if (cachedProducts) {
      return NextResponse.json({
        success: true,
        data: { products: cachedProducts.data },
      });
    }

    if (error instanceof CleanCloudApiError) {
      return NextResponse.json(
        { success: false, error: getReadableError(error.apiMessage) },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unable to load services. Please try again." },
      { status: 500 }
    );
  }
}
