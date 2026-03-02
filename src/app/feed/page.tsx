"use client";

import ProductFeed from "@/components/ProductFeed";

export default function FeedPage() {
    return (
        <main className="min-h-screen pb-20 pt-12 bg-off-white">
            <div className="max-w-7xl mx-auto">
                {/* 
                  We removed the redundant local Navbar and 'Discover Everything' header 
                  because ProductFeed already includes the animated header and 
                  the global TopNavbar handles navigation.
                */}
                <ProductFeed />

                {/* Secondary Actions */}
                <div className="text-center pb-20">
                    <button className="clay-btn px-10 py-4 text-lg lowercase">
                        load more items
                    </button>
                </div>
            </div>
        </main>
    );
}
