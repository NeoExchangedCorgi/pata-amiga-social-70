
import React from 'react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import MainFeed from '@/components/MainFeed';
import FooterBar from '@/components/FooterBar';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex w-full">
        <LeftSidebar />
        <MainFeed />
        <RightSidebar />
      </div>
      <FooterBar />
    </div>
  );
};

export default Index;
