'use client';
import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import Feed from "@/components/Feed";
import Footer from "@/components/Footer";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="home-layout">
      <Navbar onSearch={setSearchQuery} />
      <main id="main-content">
        <Feed searchQuery={searchQuery} />
      </main>
      <Footer />
    </div>
  );
}
