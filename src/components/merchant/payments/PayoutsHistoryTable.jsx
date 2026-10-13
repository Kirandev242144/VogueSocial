"use client";
import React, { useState, useMemo } from 'react';
import { Search, Building2, CheckCircle, Clock } from 'lucide-react';

export default function PayoutsHistoryTable({ transfers = [] }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const paidCount = transfers.filter(t => t.status === 'paid').length;
  const transitCount = transfers.filter(t => t.status === 'in_transit').length;

  const filtered = useMemo(() => {
    return transfers.filter(t => {
      if (filter === 'paid' && t.status !== 'paid') return false;
      if (filter === 'in_transit' && t.status !== 'in_transit') return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const idMatch = (t.id || '').toLowerCase().includes(q);
        const orderMatch = (t.orderRef || '').toLowerCase().includes(q);
        const bankMatch = (t.bank || '').toLowerCase().includes(q);
        return idMatch || orderMatch || bankMatch;
      }

      return true;
    });
  }, [transfers, filter, search]);

  return (
    <div className="pg-table-card">
      <div className="pg-table-toolbar">
        <div className="pg-tabs">
          {[
            { id: 'all', label: 'All Payouts', count: transfers.length },
            { id: 'paid', label: 'Paid', count: paidCount },
            { id: 'in_transit', label: 'In Transit', count: transitCount }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`pg-tab ${filter === tab.id ? 'pg-tab-active' : ''}`}
              onClick={() => setFilter(tab.id)}
            >
              <span>{tab.label}</span>
              <span className="pg-tab-count">{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="pg-search-wrap">
          <Search size={14} className="pg-search-icon" />
          <input
            type="text"
            placeholder="Search payout ID, order..."
            className="pg-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="pg-table-wrap">
        <table className="pg-table">
          <thead>
            <tr>
              <th>Payout ID</th>
              <th>Order</th>
              <th>Date</th>
              <th>Bank Destination</th>
              <th>Gross</th>
              <th>Platform Fee</th>
              <th>Net Disbursed</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="pg-table-empty">
                  No payouts found matching your criteria.
                </td>
              </tr>
            ) : (
              filtered.map(t => (
                <tr key={t.id}>
                  <td>
                    <span className="pg-cell-id">{t.id}</span>
                  </td>
                  <td>
                    <span className="pg-cell-order">#{t.orderRef}</span>
                  </td>
                  <td>
                    <span className="pg-cell-date">{t.date}</span>
                  </td>
                  <td>
                    <span className="pg-cell-bank">
                      <Building2 size={13} />
                      <span>{t.bank}</span>
                    </span>
                  </td>
                  <td>
                    <span className="pg-cell-gross">${t.gross.toFixed(2)}</span>
                  </td>
                  <td>
                    <span className="pg-cell-fee">-${t.fee.toFixed(2)}</span>
                  </td>
                  <td>
                    <span className="pg-cell-net">${t.net.toFixed(2)}</span>
                  </td>
                  <td>
                    {t.status === 'paid' ? (
                      <span className="pg-pill-paid">
                        <CheckCircle size={10} />
                        Paid
                      </span>
                    ) : (
                      <span className="pg-pill-transit">
                        <Clock size={10} />
                        In Transit
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
