import React from "react";

const CategoryTabs = () => {
    const categories = [
        {
            title: "Paint Your Wall With Ads",
            image: "/path-to-image2.jpg", 
        },
        {
            title: "Easy Steps to Begin",
            image: "/path-to-image2.jpg", 
        },
        {
            title: "Advertise with deWall Ads",
            image: "/path-to-image3.jpg", 
        },
    ];

    return (
        <div className="px-4 mt-4">
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
                {categories.map((category, index) => (
                    <div
                        key={index}
                        className="min-w-[250px] h-[150px] rounded-lg shadow-lg overflow-hidden bg-gray-100 flex-shrink-0"
                    >
                        <img
                            src={category.image}
                            alt={category.title}
                            className="w-full h-full object-cover"
                        />
                        
                    </div>
                ))}
            </div>
        </div>
    );
};
export default CategoryTabs;

