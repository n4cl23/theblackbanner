import { GET } from '@/app/api/health/route';

describe('GET /api/health', () => {
  it('returns a healthy response', async () => {
    const response = GET();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      status: 'ok',
      service: 'the-black-banner-v2',
    });
  });
});
