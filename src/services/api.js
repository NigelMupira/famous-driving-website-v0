const API_BASE = '/api';

export async function fetchCourses() {
  const res = await fetch(`${API_BASE}/courses`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data;
}

export async function fetchInstructors() {
  const res = await fetch(`${API_BASE}/instructors`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data;
}

export async function fetchSlots(date) {
  const res = await fetch(`${API_BASE}/bookings/slots?date=${encodeURIComponent(date)}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data;
}

export async function createBooking(bookingData) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to confirm booking');
  return data;
}

export async function fetchReviews(sort = 'newest', rating = 'all') {
  const res = await fetch(`${API_BASE}/reviews?sort=${sort}&rating=${rating}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data;
}

export async function submitReview(reviewData) {
  const res = await fetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to submit review');
  return data;
}

export async function voteReview(reviewId, voteType) {
  const res = await fetch(`${API_BASE}/reviews/${reviewId}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ voteType })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data;
}

export async function submitContact(contactData) {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contactData)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to send message');
  return data;
}

export async function fetchFaqs(category = 'All', search = '') {
  const res = await fetch(`${API_BASE}/faqs?category=${encodeURIComponent(category)}&search=${encodeURIComponent(search)}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data;
}

export async function adminLogin(username, password) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Login failed');
  return data;
}

export async function fetchAdminDashboard() {
  const res = await fetch(`${API_BASE}/admin/dashboard`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data;
}
