import React from 'react';

import { CheckCircleIcon } from '@heroicons/react/24/solid'; // Heroicons v2 import

const BenefitsSection = () => {
  const benefits = [
    'Earn from unused wall space',
    'Monetize empty walls effortlessly',
    'Seamless User Experience',
    'Support local businesses',
    'Hassle-free advertisement',
    'Monthly rent for hosting ads'
  ];

  return (
    <div className="benefits-section bg-white-100 py-12 flex justify-center">
      <div className="w-full max-w-lg bg-pink-200 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Why Use Our App?</h2>
        <ul className="space-y-4">
          {benefits.map((benefit, index) => (
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

export default BenefitsSection;
