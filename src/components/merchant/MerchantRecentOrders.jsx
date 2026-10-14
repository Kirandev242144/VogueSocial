"use client";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ExternalLink } from 'lucide-react';
import './MerchantRecentOrders.css';

const RECENT_ORDERS = [
  {
    id: '#ORD-1845',
    customer: 'Fatima Al-Rashid',
    email: 'fatima@mail.com',
    product: 'Structured Minimalist Tailored Suit',
    size: 'M',
    total: '$95.00',
    payment_status: 'paid',
    fulfillment_status: 'unfulfilled',
    date: 'Apr 29, 2026',
    image: '/Shop_images/1/basic4-500x750.jpeg'
  },
  {
    id: '#ORD-1844',
    customer: 'Riya Kapoor',
    email: 'riya@mail.com',
    product: 'Tailored Silk Blouse',
    size: 'XL',
    total: '$75.00',
    payment_status: 'pending',
    fulfillment_status: 'unfulfilled',
    date: 'Apr 29, 2026',
    image: '/Shop_images/13/wideleg1-500x750.jpg'
  },
  {
    id: '#ORD-1842',
    customer: 'Maya Lin',
    email: 'maya@mail.com',
    product: 'Tailored Silk Blouse',
    size: 'S',
    total: '$120.00',
    payment_status: 'paid',
    fulfillment_status: 'fulfilled',
    date: 'Apr 28, 2026',
    image: '/Shop_images/1/basic2-500x750.jpeg'
  },
  {
    id: '#ORD-1841',
    customer: 'Aisha Malik',
    email: 'aisha@mail.com',
    product: 'Tailored Silk Blouse',
    size: 'M',
    total: '$49.00',
    payment_status: 'paid',
    fulfillment_status: 'unfulfilled',
    date: 'Apr 29, 2026',
    image: '/Shop_images/1/basic2-500x750.jpeg'
  }
];

export default function MerchantRecentOrders() {
  const navigate = useNavigate();

  return (
    <div className="merchant-recent-orders-card">
      <div className="merchant-recent-orders-header">
        <div className="merchant-recent-orders-title">
          <ShoppingBag size={16} />
          <span>Recent Customer Orders</span>
        </div>
        <button
          type="button"
          className="merchant-recent-orders-view-all"
          onClick={() => navigate('/merchant/orders')}
        >
          <span>View All Orders</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="merchant-recent-orders-table-wrap">
        <table className="merchant-recent-orders-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Garment Item</th>
              <th>Payment</th>
              <th>Fulfillment</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_ORDERS.map((order) => (
              <tr key={order.id}>
                <td>
                  <span
                    className="merchant-order-id-link"
                    onClick={() => navigate('/merchant/orders')}
                    title="View in Orders"
                  >
                    {order.id}
                  </span>
                </td>
                <td>
                  <div className="merchant-order-cust-cell">
                    <span className="merchant-order-cust-name">{order.customer}</span>
                    <span className="merchant-order-cust-email">{order.email}</span>
                  </div>
                </td>
                <td>
                  <div className="merchant-order-item-cell">
                    <img
                      src={order.image}
                      alt={order.product}
                      className="merchant-order-thumb"
                      onError={(e) => {
                        e.target.src = '/Shop_images/1/basic2-500x750.jpeg';
                      }}
                    />
                    <div className="merchant-order-item-meta">
                      <span className="merchant-order-item-name">{order.product}</span>
                      <span className="merchant-order-item-size">Size {order.size}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`merchant-badge-status ${order.payment_status === 'paid' ? 'merchant-badge-paid' : 'merchant-badge-pending'}`}>
                    <span className="merchant-status-dot" />
                    {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                  </span>
                </td>
                <td>
                  <span className={`merchant-badge-status ${order.fulfillment_status === 'fulfilled' ? 'merchant-badge-fulfilled' : 'merchant-badge-unfulfilled'}`}>
                    <span className="merchant-status-dot" />
                    {order.fulfillment_status === 'fulfilled' ? 'Fulfilled' : 'Unfulfilled'}
                  </span>
                </td>
                <td>
                  <span className="merchant-order-amount">{order.total}</span>
                </td>
                <td>
                  <button
                    type="button"
                    className={order.fulfillment_status === 'unfulfilled' ? 'merchant-btn-table-primary' : 'merchant-btn-table-secondary'}
                    onClick={() => navigate('/merchant/orders')}
                  >
                    {order.fulfillment_status === 'unfulfilled' ? 'Fulfill' : 'View'}
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
