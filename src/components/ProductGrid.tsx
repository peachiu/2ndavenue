"use client";

import ProductCard from "./ProductCard";

interface Product {
    id: number;
    title: string;
    price: number;
    currency: string;
    category: string;
    condition_rating: string;
    image_url: string;
}

interface ProductGridProps {
    products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
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
                            title={product.title}
                            price={product.price}
                            currency={product.currency}
                            image_url={product.image_url}
                            condition={product.condition_rating}
                        />
                    </div>
                );
            })}
        </div>
    );
}
