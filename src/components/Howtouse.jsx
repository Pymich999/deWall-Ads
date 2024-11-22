import React from 'react';

import { CheckCircleIcon } from '@heroicons/react/24/solid'; // Heroicons v2 import

const Howto = () => {
    const steps = [
        'Click the (+) icon below',
        'Enter the size and location detail',
        'Choose preferred price',
        'Upload 3 images of your wall',
        'Submit for approval',
        'Wait for verification from our team'
    ];

    return (
        <div className="benefits-section bg-white-100 py-12 flex justify-center">
            <div className="w-full max-w-lg bg-orange-200 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-orange-600">How it works</h2>
                <h2 className=' text-center mb-6 mt-1 text-orange-600'>Follow these simple steps</h2>
                <ul className="space-y-4">
                    {steps.map((benefit, index) => (
                        <li key={index} className="flex items-start space-x-2">
                            <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0" />
                            <span className="text-lg text-gray-700">{benefit}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Howto;