"use client";

import Link from 'next/link';
import Image from 'next/image';
import logo from '../../assets/logo.png';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white mt-20">
            <div className="page-container py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-lg overflow-hidden">
                                <Image src={logo} alt="IC" width={40} height={40} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xl font-bold">Infinite Creations</span>
                        </div>
                        <p className="text-gray-400 max-w-md">
                            Discover premium products curated for quality and style.
                            Your satisfaction is our priority.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link href="/shop" className="hover:text-white transition-colors">Shop All</Link></li>
                            <li><Link href="/categories" className="hover:text-white transition-colors">Categories</Link></li>
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Support</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link href="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
                            <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping</Link></li>
                            <li><Link href="/returns" className="hover:text-white transition-colors">Returns</Link></li>
                            <li><Link href="/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">
                        © 2024 Infinite Creations. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-gray-400 text-sm">
                        <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
