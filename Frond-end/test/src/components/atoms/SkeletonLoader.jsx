import React from 'react';

/**
 * Flexible skeleton loader component.
 * 
 * Usage:
 *   <SkeletonLoader type="product-card" count={4} />
 *   <SkeletonLoader type="product-detail" />
 *   <SkeletonLoader type="order-row" count={5} />
 *   <SkeletonLoader type="text" lines={3} />
 */

const pulse = "animate-pulse bg-gray-200 dark:bg-gray-700 rounded";

const skeletons = {
    // Product grid card
    'product-card': () => (
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5">
            <div className={`aspect-square ${pulse}`} />
            <div className="p-4 space-y-3">
                <div className={`h-3 ${pulse} w-3/4`} />
                <div className={`h-3 ${pulse} w-1/2`} />
                <div className="flex gap-2">
                    <div className={`h-6 ${pulse} w-16`} />
                </div>
                <div className={`h-10 ${pulse} rounded-xl`} />
            </div>
        </div>
    ),

    // Full product detail page
    'product-detail': () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className={`aspect-square ${pulse} rounded-3xl`} />
            <div className="space-y-5">
                <div className={`h-4 ${pulse} w-1/3`} />
                <div className={`h-8 ${pulse} w-full`} />
                <div className={`h-8 ${pulse} w-2/3`} />
                <div className={`h-4 ${pulse} w-1/4`} />
                <div className="space-y-2">
                    <div className={`h-3 ${pulse} w-full`} />
                    <div className={`h-3 ${pulse} w-full`} />
                    <div className={`h-3 ${pulse} w-3/4`} />
                </div>
                <div className={`h-14 ${pulse} rounded-2xl`} />
                <div className={`h-14 ${pulse} rounded-2xl`} />
            </div>
        </div>
    ),

    // Order row in table
    'order-row': () => (
        <tr className="border-b border-gray-100 dark:border-gray-800">
            {[1, 2, 3, 4, 5].map(i => (
                <td key={i} className="px-4 py-4">
                    <div className={`h-4 ${pulse} w-full`} />
                </td>
            ))}
        </tr>
    ),

    // Generic text block
    'text': ({ lines = 3 }) => (
        <div className="space-y-2">
            {[...Array(lines)].map((_, i) => (
                <div key={i} className={`h-3 ${pulse} ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
            ))}
        </div>
    ),

    // Review card
    'review': () => (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-white/5">
            <div className="flex gap-3 mb-3">
                <div className={`w-10 h-10 ${pulse} rounded-xl flex-shrink-0`} />
                <div className="flex-1 space-y-2">
                    <div className={`h-3 ${pulse} w-32`} />
                    <div className={`h-3 ${pulse} w-20`} />
                </div>
            </div>
            <div className="space-y-2">
                <div className={`h-3 ${pulse} w-full`} />
                <div className={`h-3 ${pulse} w-3/4`} />
            </div>
        </div>
    ),

    // Navbar
    'navbar': () => (
        <div className="flex items-center justify-between px-6 py-4">
            <div className={`h-8 w-32 ${pulse} rounded-xl`} />
            <div className="flex gap-4">
                {[1,2,3,4].map(i => <div key={i} className={`h-4 w-20 ${pulse} rounded`} />)}
            </div>
            <div className="flex gap-3">
                {[1,2,3].map(i => <div key={i} className={`w-10 h-10 ${pulse} rounded-xl`} />)}
            </div>
        </div>
    ),

    // Category pill
    'category': () => (
        <div className={`h-10 w-28 ${pulse} rounded-full`} />
    ),
};

const SkeletonLoader = ({ type = 'product-card', count = 1, lines, className = '' }) => {
    const Skeleton = skeletons[type] || skeletons['text'];
    const items = Array(count).fill(null);

    return (
        <>
            {items.map((_, i) => (
                <div key={i} className={className}>
                    <Skeleton lines={lines} />
                </div>
            ))}
        </>
    );
};

export default SkeletonLoader;
