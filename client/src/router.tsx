import { Routes, Route } from 'react-router-dom';
import { HomePage } from './features/home/HomePage';
import { SendPage } from './features/send/SendPage';
import { ReceivePage } from './features/receive/ReceivePage';
import { TransferPage } from './features/transfer/TransferPage';
import { CompletePage } from './features/complete/CompletePage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/send" element={<SendPage />} />
      <Route path="/receive" element={<ReceivePage />} />
      <Route path="/transfer/:sessionId" element={<TransferPage />} />
      <Route path="/complete/:sessionId" element={<CompletePage />} />
    </Routes>
  );
}