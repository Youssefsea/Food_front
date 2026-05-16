import api from '@/lib/api';
import { ENDPOINTS } from '@/lib/constants';

export async function confirmPayment(paymentId: number) {
  const res = await api.post(ENDPOINTS.CONFIRM_PAYMENT, { paymentId });
  return res.data;
}
