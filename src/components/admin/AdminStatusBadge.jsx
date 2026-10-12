"use client";
import React from 'react';
import {
  CheckCircle, AlertTriangle, ShieldAlert, MessageSquare, Clock, XCircle
} from 'lucide-react';

export default function AdminStatusBadge({ status, type = 'general' }) {
  const norm = (status || '').toLowerCase();

  // Product status mapping
  if (norm === 'live' || norm === 'approved') {
    return (
      <span className="admin-badge badge-live">
        <CheckCircle size={11} /> {norm === 'live' ? 'Live Market' : 'Active Approved'}
      </span>
    );
  }

  if (norm === 'pending_approval' || norm === 'pending' || norm === 'in_queue') {
    return (
      <span className="admin-badge badge-pending">
        <Clock size={11} /> {norm === 'in_queue' ? 'In Queue' : 'Pending Review'}
      </span>
    );
  }

  if (norm === 'changes_requested' || norm === 'under_review' || norm === 'in_progress') {
    return (
      <span className="admin-badge badge-changes">
        <MessageSquare size={11} /> {norm === 'in_progress' ? 'In Progress' : (norm === 'under_review' ? 'Under Review' : 'Changes Requested')}
      </span>
    );
  }

  if (norm === 'rejected' || norm === 'suspended' || norm === 'failed') {
    return (
      <span className="admin-badge badge-rejected">
        <ShieldAlert size={11} /> {norm === 'failed' ? 'Failed' : (norm === 'suspended' ? 'Suspended' : 'Rejected')}
      </span>
    );
  }

  // Escrow status mapping
  if (norm === 'held') {
    return (
      <span className="admin-badge badge-held">
        <AlertTriangle size={11} /> Held in Escrow
      </span>
    );
  }

  if (norm === 'released' || norm === 'resolved_released') {
    return (
      <span className="admin-badge badge-released">
        <CheckCircle size={11} /> Escrow Released
      </span>
    );
  }

  if (norm === 'refunded' || norm === 'resolved_refunded') {
    return (
      <span className="admin-badge badge-refunded">
        <XCircle size={11} /> Refunded Buyer
      </span>
    );
  }

  if (norm === 'disputed' || norm === 'open') {
    return (
      <span className="admin-badge badge-disputed">
        <AlertTriangle size={11} /> Disputed
      </span>
    );
  }

  if (norm === 'completed') {
    return (
      <span className="admin-badge badge-live">
        <CheckCircle size={11} /> Completed
      </span>
    );
  }

  return (
    <span className="admin-badge" style={{ background: 'var(--adm-panel-hover)', color: 'var(--adm-text-sub)' }}>
      {status}
    </span>
  );
}
