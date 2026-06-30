"use client";

import ProductCard from "./ProductCard";

interface Product {
    id: number;
    title: string;
    price: number;
    currency: string;
    condition_rating: string;
    image_url: string;
}

interface ProductGridProps {
    products: Product[];
    layout?: "grid" | "list" | "mosaic";
}

export default function ProductGrid({ products, layout = "grid" }: ProductGridProps) {
    // ── Grid layout (uniform squares) ──────────────────────
    if (layout === "grid") {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        title={product.title}
                        price={product.price}
                        currency={product.currency}
                        image_url={product.image_url}
                        condition={product.condition_rating}
                        variant="grid"
                    />
                ))}
            </div>
        );
    }

    // ── List layout (horizontal rows) ──────────────────────
    if (layout === "list") {
        return (
            <div className="flex flex-col gap-4">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        title={product.title}
                        price={product.price}
                        currency={product.currency}
                        image_url={product.image_url}
                        condition={product.condition_rating}
                        variant="list"
                    />
                ))}
            </div>
        );
    }

    // ── Mosaic layout (bento / current) ────────────────────
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 grid-auto-flow-dense">
            <style jsx>{`
                .grid-auto-flow-dense {
                    grid-auto-flow: dense;
                }
            `}</style>

            {products.map((product, index) => {
                // Algorithmic Bento Logic
                let spanClasses = "col-span-1 row-span-1";

                // Every 7th item is BIG (2x2)
                if ((index + 1) % 7 === 0) {
                    spanClasses = "md:col-span-2 md:row-span-2";
                }
                // Every 3rd item is TALL (1x2)
                else if ((index + 1) % 3 === 0) {
                    spanClasses = "md:row-span-2";
                }

                return (
                    <div key={product.id} className={spanClasses}>
                        <ProductCard
                            id={product.id}
                            title={product.title}
                            price={product.price}
                            currency={product.currency}
                            image_url={product.image_url}
                            condition={product.condition_rating}
                            variant="mosaic"
                        />
                    </div>
                );
            })}
        </div>
    );
}
