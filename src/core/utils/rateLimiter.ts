class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  isAllowed(key: string, limit: number, window: number): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    const validRequests = requests.filter((time) => now - time < window);
    if (validRequests.length >= limit) {
      return false;
    }
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
}

export const rateLimiter = new RateLimiter();
