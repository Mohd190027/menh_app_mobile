/* غلاف ضمين: التوجيه بين الصفحات مع انتقالات حركية + الهيكل + التوست + محرّك التحرير التلقائي */
'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'sonner';
import { routeKey, useDameen } from './state';
import { AuthModal, BottomNav, CartDrawer, Footer, TopBar } from './chrome';
import { HomePage, SearchPage, SectionPage, StorePage } from './shop-home';
import { CheckoutPage, ProductPage, SuccessPage } from './shop-buy';
import { AccountPage, DisputesPage, DLibPage, FavoritesPage, OrdersPage } from './user';
import { MerchantPanel } from './merchant';
import { AdminPanel } from './admin';

export default function DameenApp() {
  const route = useDameen(s => s.route);
  const session = useDameen(s => s.session);

  /* محرّك ضمين: تحرير تلقائي بانتهاء نافذة الحماية (كل ثانية) */
  useEffect(() => {
    const t = setInterval(() => useDameen.getState().tick(), 1000);
    return () => clearInterval(t);
  }, []);

  const page = (() => {
    switch (route.name) {
      case 'home': return <HomePage />;
      case 'section': return <SectionPage id={route.id} />;
      case 'store': return <StorePage id={route.id} />;
      case 'product': return <ProductPage id={route.id} />;
      case 'search': return <SearchPage q={route.q} />;
      case 'checkout': return <CheckoutPage />;
      case 'success': return <SuccessPage id={route.id} />;
      case 'orders': return <OrdersPage />;
      case 'favorites': return <FavoritesPage />;
      case 'account': return <AccountPage />;
      case 'disputes': return <DisputesPage />;
      case 'dlib': return <DLibPage />;
      case 'merchant': return <MerchantPanel tab={route.tab} />;
      case 'admin': return <AdminPanel tab={route.tab} />;
      default: return <HomePage />;
    }
  })();

  const isShopper = !session || session.role === 'customer';

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <main className={`flex-1 w-full max-w-6xl mx-auto px-3 md:px-6 pt-4 md:pt-6 ${isShopper ? 'pb-24 md:pb-8' : 'pb-8'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={routeKey(route)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {page}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      {isShopper && <BottomNav />}
      <AuthModal />
      <CartDrawer />
      <Toaster position="top-center" offset="64px" richColors dir="rtl" theme="light" toastOptions={{ style: { fontFamily: 'Cairo, Segoe UI, sans-serif', fontWeight: 600 } }} />
    </div>
  );
}
