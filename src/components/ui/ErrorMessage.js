"use client";

import { AlertCircle, XCircle } from 'lucide-react';

export default function ErrorMessage({ message, onRetry }) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex items-center gap-2 text-red-500">
                <AlertCircle size={24} />
                <span className="text-lg font-medium">Something went wrong</span>
            </div>
            <p className="text-gray-600 max-w-md">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors"
                >
                    Try Again
                </button>
            )}
        </div>
    );
}
