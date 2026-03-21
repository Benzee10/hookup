
import React, { useState, useEffect } from 'react';

interface FilterBarProps {
  categories: string[];
  onFilterChange: (filters: { category: string; }) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ categories, onFilterChange }) => {
  const [category, setCategory] = React.useState('');

  useEffect(() => {
    onFilterChange({ category });
  }, [category, onFilterChange]);

  const handleReset = () => {
    setCategory('');
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-8 flex flex-col md:flex-row items-center gap-4">
      <div className="w-full md:w-2/3">
        <label htmlFor="category-filter" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
        <select
          id="category-filter"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border border-slate-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"
        >
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      <div className="w-full md:w-auto md:pt-6">
        <button onClick={handleReset} className="w-full md:w-auto bg-slate-200 text-slate-700 px-6 py-2 rounded-md hover:bg-slate-300 transition">Reset</button>
      </div>
    </div>
  );
};

export default FilterBar;