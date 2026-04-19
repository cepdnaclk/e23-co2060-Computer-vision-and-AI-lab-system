import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { equipmentAPI } from '../services/api';
import { Search, SlidersHorizontal, Camera, Cpu, Wind, Activity, X, ChevronRight, Package } from 'lucide-react';
import './EquipmentCatalog.css';

const ICON_MAP = {
  camera: Camera, cpu: Cpu, drone: Wind, activity: Activity,
  aperture: Camera, sun: Activity, default: Package
};

const STATUS_COLOR = {
  excellent: '#0a7a45', good: '#0a7a45', fair: '#d97706', under_maintenance: '#c0392b'
};

export default function EquipmentCatalog() {
  const [equipment, setEquipment] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAvailable, setShowAvailable] = useState(false);

  const fetchEquipment = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;
      if (showAvailable) params.available = 'true';
      const res = await equipmentAPI.getAll(params);
      setEquipment(res.data.equipment);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, showAvailable]);

  useEffect(() => {
    equipmentAPI.getCategories().then(res => setCategories(res.data.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchEquipment, 300);
    return () => clearTimeout(timer);
  }, [fetchEquipment]);

  const clearFilters = () => {
    setSearch(''); setSelectedCategory(''); setShowAvailable(false);
  };

  const hasFilters = search || selectedCategory || showAvailable;

  return (
    <div className="catalog-page">
      <div className="page-header">
        <h1>Equipment Catalog</h1>
        <p>Browse and book lab equipment for your research</p>
      </div>

      {/* Search & Filters */}
      <div className="catalog-toolbar">
        <div className="search-bar">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search equipment, models..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}><X size={14} /></button>
          )}
        </div>

        <div className="filter-row">
          <SlidersHorizontal size={15} className="filter-icon" />
          <div className="category-tabs">
            <button
              className={`cat-tab ${!selectedCategory ? 'active' : ''}`}
              onClick={() => setSelectedCategory('')}
            >All</button>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`cat-tab ${selectedCategory === cat.name ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.name === selectedCategory ? '' : cat.name)}
              >{cat.name}</button>
            ))}
          </div>

          <label className="avail-toggle">
            <input type="checkbox" checked={showAvailable} onChange={e => setShowAvailable(e.target.checked)} />
            <span>Available only</span>
          </label>

          {hasFilters && (
            <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
              <X size={13} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <div className="results-meta">
          Showing <strong>{equipment.length}</strong> item{equipment.length !== 1 ? 's' : ''}
          {hasFilters && ' (filtered)'}
        </div>
      )}

      {/* Equipment Grid */}
      {loading ? (
        <div className="catalog-skeleton">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
        </div>
      ) : equipment.length === 0 ? (
        <div className="empty-state">
          <Package size={48} />
          <h3>No equipment found</h3>
          <p>Try adjusting your search or filters</p>
          {hasFilters && <button className="btn btn-outline btn-sm" onClick={clearFilters}>Clear filters</button>}
        </div>
      ) : (
        <div className="equipment-grid">
          {equipment.map((item, idx) => {
            const IconComp = ICON_MAP[item.category_icon] || ICON_MAP.default;
            const isAvailable = item.available_quantity > 0;
            return (
              <div key={item.id} className="eq-card fade-up" style={{ animationDelay: `${idx * 40}ms` }}>
                <div className="eq-card-image">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} />
                  ) : (
                    <div className="eq-placeholder">
                      <IconComp size={40} />
                    </div>
                  )}
                  <div className={`eq-avail-badge ${isAvailable ? 'avail' : 'unavail'}`}>
                    {isAvailable ? `${item.available_quantity} available` : 'Unavailable'}
                  </div>
                </div>
                <div className="eq-card-body">
                  <div className="eq-category">
                    <IconComp size={12} />
                    {item.category_name}
                  </div>
                  <h3 className="eq-name">{item.name}</h3>
                  <p className="eq-model">{item.model}</p>
                  <p className="eq-desc">{item.description}</p>

                  <div className="eq-meta">
                    <span className="eq-condition" style={{ color: STATUS_COLOR[item.condition] || '#555' }}>
                      ● {item.condition}
                    </span>
                    <span className="eq-location">📍 {item.location}</span>
                  </div>

                  <div className="eq-footer">
                    <span className="eq-price">
                      {item.requires_payment ? `Rs. ${item.daily_rate}/day` : 'Free'}
                    </span>
                    <Link to={`/equipment/${item.id}`} className="btn btn-primary btn-sm">
                      Details <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}