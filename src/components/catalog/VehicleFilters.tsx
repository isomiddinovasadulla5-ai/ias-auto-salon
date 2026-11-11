import React from 'react';
import { FilterState, FuelType, TransmissionType, BodyType } from '../../types';
import { useSalon } from '../../context/SalonContext';
import {
  Search,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface VehicleFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  availableBrands: string[];
}

export const VehicleFilters: React.FC<VehicleFiltersProps> = ({
  filters,
  onChange,
  onReset,
  availableBrands,
}) => {
  const { t } = useSalon();

  const handleUpdate = (key: keyof FilterState, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  const fuelOptions: { id: string; label: string }[] = [
    { id: '', label: t.catalog.filterAll },
    { id: 'electric', label: t.fuelTypes.electric },
    { id: 'hybrid', label: t.fuelTypes.hybrid },
    { id: 'petrol', label: t.fuelTypes.petrol },
    { id: 'diesel', label: t.fuelTypes.diesel },
  ];

  const bodyOptions: { id: string; label: string }[] = [
    { id: '', label: t.catalog.filterAll },
    { id: 'sedan', label: t.bodyTypes.sedan },
    { id: 'suv', label: t.bodyTypes.suv },
    { id: 'coupe', label: t.bodyTypes.coupe },
    { id: 'crossover', label: t.bodyTypes.crossover },
  ];

  const transmissionOptions: { id: string; label: string }[] = [
    { id: '', label: t.catalog.filterAll },
    { id: 'automatic', label: t.transmissions.automatic },
    { id: 'manual', label: t.transmissions.manual },
    { id: 'robot', label: t.transmissions.robot },
  ];

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 mb-8 shadow-xl backdrop-blur-xl">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        {/* Search Query */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => handleUpdate('searchQuery', e.target.value)}
            placeholder={t.hero.searchPlaceholder}
            className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Sorting & Reset */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-semibold whitespace-nowrap">
              {t.catalog.sortBy}:
            </span>
            <select
              value={filters.sortBy}
              onChange={(e) => handleUpdate('sortBy', e.target.value)}
              className="bg-zinc-950 border border-zinc-700/80 rounded-xl px-3 py-2 text-xs font-bold text-zinc-200 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="featured">{t.catalog.sortFeatured}</option>
              <option value="price_asc">{t.catalog.sortPriceAsc}</option>
              <option value="price_desc">{t.catalog.sortPriceDesc}</option>
              <option value="year_desc">{t.catalog.sortYearDesc}</option>
              <option value="mileage_asc">{t.catalog.sortMileageAsc}</option>
            </select>
          </div>

          <button
            onClick={onReset}
            className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer shrink-0"
            title={t.catalog.resetFilters}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.catalog.resetFilters}</span>
          </button>
        </div>
      </div>

      {/* Filter Grids */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 pt-4">
        {/* Brand */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-400 mb-1.5">
            {t.catalog.brand}
          </label>
          <select
            value={filters.brand}
            onChange={(e) => handleUpdate('brand', e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-2.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="">{t.catalog.allBrands}</option>
            {availableBrands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Body Type */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-400 mb-1.5">
            {t.catalog.bodyType}
          </label>
          <select
            value={filters.bodyType}
            onChange={(e) => handleUpdate('bodyType', e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-2.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            {bodyOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-400 mb-1.5">
            {t.catalog.fuelType}
          </label>
          <select
            value={filters.fuelType}
            onChange={(e) => handleUpdate('fuelType', e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-2.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            {fuelOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-400 mb-1.5">
            {t.catalog.transmission}
          </label>
          <select
            value={filters.transmission}
            onChange={(e) => handleUpdate('transmission', e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-2.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            {transmissionOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range (Min - Max) */}
        <div className="col-span-2 sm:col-span-1 lg:col-span-2">
          <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-400 mb-1.5">
            {t.catalog.priceRange}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min $"
              value={filters.minPrice || ''}
              onChange={(e) => handleUpdate('minPrice', Number(e.target.value) || 0)}
              className="w-1/2 bg-zinc-950 border border-zinc-700/80 rounded-xl px-2.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
            />
            <span className="text-zinc-500 text-xs">-</span>
            <input
              type="number"
              placeholder="Maks $"
              value={filters.maxPrice || ''}
              onChange={(e) => handleUpdate('maxPrice', Number(e.target.value) || 0)}
              className="w-1/2 bg-zinc-950 border border-zinc-700/80 rounded-xl px-2.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
