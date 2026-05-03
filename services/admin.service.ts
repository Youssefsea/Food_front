import api from '@/lib/api';
import { ENDPOINTS } from '@/lib/constants';

export async function confirmPayment(paymentId: number, status: 'approved' | 'rejected') {
  const res = await api.post(ENDPOINTS.CONFIRM_PAYMENT, { paymentId, status });
  return res.data;
}
