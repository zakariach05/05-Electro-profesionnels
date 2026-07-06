import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Breadcrumb navigation component.
 * Accepts an array of { label, href } items.
 * Automatically adds "Accueil" as the first item.
 *
 * Usage:
 *   <Breadcrumb items={[
 *     { label: 'Boutique', href: '/shop' },
 *     { label: 'Ordinateurs', href: '/shop/ordinateurs' },
 *     { label: product.name }  // no href = current page (not a link)
 *   ]} />
 */
const Breadcrumb = ({ items = [], className = '' }) => {
    if (!items.length) return null;

    const all = [{ label: 'Accueil', href: '/' }, ...items];

    return (
        <nav aria-label="Fil d'Ariane" className={`flex items-center flex-wrap gap-1 text-sm ${className}`}>
            {all.map((item, index) => {
                const isLast = index === all.length - 1;
                return (
                    <React.Fragment key={index}>
                        {index === 0 ? (
                            // Home icon for the first item
                            item.href ? (
                                <Link
                                    to={item.href}
                                    className="flex items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors font-medium"
                                    aria-label="Accueil"
                                >
                                    <Home size={14} />
                                </Link>
                            ) : (
                                <span className="flex items-center gap-1 text-gray-400">
                                    <Home size={14} />
                                </span>
                            )
                        ) : (
                            <>
                                <ChevronRight size={14} className="text-gray-300 dark:text-gray-600 flex-shrink-0" />
                                {item.href && !isLast ? (
                                    <Link
                                        to={item.href}
                                        className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium truncate max-w-[160px]"
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <span
                                        className={`truncate max-w-[200px] font-medium ${isLast ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'}`}
                                        aria-current={isLast ? 'page' : undefined}
                                    >
                                        {item.label}
                                    </span>
                                )}
                            </>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

export default Breadcrumb;
