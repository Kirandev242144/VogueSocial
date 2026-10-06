"use client";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '@/app/merchant/merchant.module.css';
import { Shirt, Sparkles } from 'lucide-react';

export const TOP_GARMENTS = [
  {
    id: 'dd8d7fe4-7680-4b0e-8198-67720e00045d',
    name: 'Structured Double-Breasted Trench',
    category: 'Outerwear',
    price: '$520.00',
    tryons: '14,820',
    conversionRate: '42.6%',
    revenue: '$148,200',
    stock: 'In Stock',
    stockClass: styles.badgeLive,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=200&q=80'
  },
  {
    id: 'e01a7924-f7b5-4bfe-9831-297c8d9d20c1',
    name: 'Silk Charmeuse Bias-Cut Slip Dress',
    category: 'Eveningwear',
    price: '$340.00',
    tryons: '12,410',
    conversionRate: '38.4%',
    revenue: '$86,360',
    stock: 'High Demand',
    stockClass: styles.badgeShipped,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&q=80'
  },
  {
    id: 'c89b8842-a123-4d76-b998-12e34567890a',
    name: 'Minimalist Relaxed Cashmere Knit',
    category: 'Knitwear',
    price: '$290.00',
    tryons: '9,640',
    conversionRate: '35.1%',
    revenue: '$62,640',
    stock: 'In Stock',
    stockClass: styles.badgeLive,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&q=80'
  },
  {
    id: 'b12c3456-d789-4e01-f234-567890abcdef',
    name: 'Italian Wool Pleated Wide-Leg Trouser',
    category: 'Tailored Suiting',
    price: '$260.00',
    tryons: '8,190',
    conversionRate: '33.8%',
    revenue: '$47,320',
    stock: 'Low Stock',
    stockClass: styles.badgePending,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200&q=80'
  },
  {
    id: 'a98b7654-c321-4d56-e789-0123456789ab',
    name: 'Sculpted Leather Biker Jacket',
    category: 'Outerwear',
    price: '$780.00',
    tryons: '6,430',
    conversionRate: '29.7%',
    revenue: '$49,920',
    stock: 'In Stock',
    stockClass: styles.badgeLive,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&q=80'
  },
];

export default function MerchantTopGarments({ onPreviewGarment }) {
  const navigate = useNavigate();

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitle}>
          <Shirt size={17} />
          <span>Top Garments in Virtual Fitting Room</span>
        </div>
        <button className={styles.panelAction} onClick={() => navigate('/merchant/products')}>
          Manage Garments
        </button>
      </div>

      <div className={styles.tableScrollWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Garment</th>
              <th>Price</th>
              <th>Try-Ons</th>
              <th>Conversion</th>
              <th>GMV</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {TOP_GARMENTS.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className={styles.garmentCell}>
                    <img src={item.image} alt={item.name} className={styles.garmentThumb} />
                    <div className={styles.garmentInfo}>
                      <span className={styles.garmentName}>{item.name}</span>
                      <span className={styles.garmentCategory}>{item.category}</span>
                    </div>
                  </div>
                </td>
                <td>{item.price}</td>
                <td>{item.tryons}</td>
                <td>{item.conversionRate}</td>
                <td>{item.revenue}</td>
                <td>
                  <span className={`${styles.badge} ${item.stockClass}`}>
                    {item.stock}
                  </span>
                </td>
                <td>
                  <button
                    className={styles.tableActionBtn}
                    onClick={() => onPreviewGarment && onPreviewGarment(item)}
                    title="Test virtual try-on on this garment"
                  >
                    <Sparkles size={12} />
                    <span>Preview</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
